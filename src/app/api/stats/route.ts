import { NextResponse } from 'next/server';
import { supabaseDatabaseService } from '@/lib/database-supabase';

export async function GET() {
  try {
    const stats = await supabaseDatabaseService.getStorageStats();
    
    return NextResponse.json({
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 