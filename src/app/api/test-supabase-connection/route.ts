import { NextResponse } from 'next/server';
import { supabaseDatabaseService } from '@/lib/database-supabase';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    console.log('Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key length:', supabaseKey?.length || 0)
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { error: notesError } = await supabase
      .from('notes')
      .select('count')
      .limit(1);
    
    if (notesError) {
      return NextResponse.json({
        success: false,
        error: 'Notes table error: ' + notesError.message,
        code: notesError.code
      }, { status: 500 });
    }
    
    // Test images table
    const { error: imagesError } = await supabase
      .from('images')
      .select('count')
      .limit(1);
    
    if (imagesError) {
      return NextResponse.json({
        success: false,
        error: 'Images table error: ' + imagesError.message,
        code: imagesError.code
      }, { status: 500 });
    }
    
    // Test storage stats
    const stats = await supabaseDatabaseService.getStorageStats();
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      notesTable: 'OK',
      imagesTable: 'OK',
      stats,
      message: 'Supabase connection and tables are working correctly'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 