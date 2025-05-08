import { type NextRequest, NextResponse } from 'next/server';
import { getItems, getAttributes, getStats } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { giftName: string } }
) {
  try {
    // Using await to ensure params is properly awaited
    const { giftName } = await Promise.resolve(params);
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'id-asc';
    const includeAttributes = searchParams.get('include_attributes') === 'true';

    // Parse attributes if provided
    let attributes: Record<string, string[]> = {};
    const attributesParam = searchParams.get('attributes');
    if (attributesParam) {
      try {
        attributes = JSON.parse(attributesParam);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid attributes format', details: (error as Error).message },
          { status: 400 }
        );
      }
    }

    // Run all requests in parallel
    const [itemsResult, attributesResult, statsResult] = await Promise.all([
      getItems(giftName, page, limit, sort, attributes),
      includeAttributes ? getAttributes(giftName) : Promise.resolve({}),
      getStats(giftName)
    ]);

    // Combine the results into a single response
    return NextResponse.json({
      collectionData: {
        giftName,
        items: itemsResult.items,
        totalItems: itemsResult.totalItems,
        totalPages: itemsResult.totalPages,
        page: itemsResult.page
      },
      attributes: includeAttributes ? attributesResult : {},
      stats: statsResult
    });
  } catch (error) {
    console.error(`Error fetching collection data for ${params.giftName}:`, error);

    if ((error as Error).message.includes('not found')) {
      return NextResponse.json(
        { error: `No database found for ${params.giftName}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch collection data for ${params.giftName}`, details: (error as Error).message },
      { status: 500 }
    );
  }
}
