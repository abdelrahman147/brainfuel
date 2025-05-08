import { type NextRequest, NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { giftName: string } }
) {
  try {
    // Using await to ensure params is properly awaited
    const { giftName } = await Promise.resolve(params);
    const stats = await getStats(giftName);
    return NextResponse.json(stats);
  } catch (error) {
    console.error(`Error fetching stats for ${params.giftName}:`, error);

    if ((error as Error).message.includes('not found')) {
      return NextResponse.json(
        { error: `No database found for ${params.giftName}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch stats for ${params.giftName}`, details: (error as Error).message },
      { status: 500 }
    );
  }
}
