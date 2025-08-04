import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // First, get a real note ID
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('id')
      .limit(1);
    
    if (notesError || !notes || notes.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No notes found to test with',
      }, { status: 400 });
    }
    
    const realNoteId = notes[0].id;
    
    // Create a small test image data with real note ID
    const testImageData = {
      id: `test_img_${Date.now()}`,
      note_id: realNoteId,
      blob_key: `test_blob_${Date.now()}`,
      alt: 'Test image',
      width: 100,
      height: 100,
      data: new Uint8Array([1, 2, 3, 4, 5]), // Small test data
    };
    
    console.log('Attempting to insert test image with real note ID:', testImageData);
    
    const { data, error } = await supabase
      .from('images')
      .insert(testImageData)
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Test image inserted successfully'
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 