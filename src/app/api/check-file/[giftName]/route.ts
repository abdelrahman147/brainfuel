import { type NextRequest, NextResponse } from 'next/server';
import { checkFile } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { giftName: string } }
) {
  try {
    // Using await to ensure params is properly awaited
    const { giftName } = await Promise.resolve(params);
    const exists = await checkFile(giftName);
    return NextResponse.json(exists);
  } catch (error) {
    console.error(`Error checking file for ${params.giftName}:`, error);
    return NextResponse.json(
      { error: `Failed to check file for ${params.giftName}`, details: (error as Error).message },
      { status: 500 }
    );
  }
}
