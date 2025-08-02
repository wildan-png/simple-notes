import { NextResponse } from 'next/server';
import { databaseService } from '@/lib/database';

export async function GET() {
  try {
    // Check database connection
    const stats = await databaseService.getStorageStats();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        stats,
      },
      version: '1.0.0',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      version: '1.0.0',
    }, { status: 503 });
  }
} 