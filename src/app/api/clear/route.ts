import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    const body = await request.json();
    const { confirm } = body;

    if (confirm !== 'true') {
      return NextResponse.json(
        { error: 'Confirmation required. Send { "confirm": "true" }' },
        { status: 400 }
      );
    }

    await databaseService.clearAllData();

    return NextResponse.json({
      success: true,
      message: 'All data cleared successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json(
      { error: 'Failed to clear data' },
      { status: 500 }
    );
  }
} 