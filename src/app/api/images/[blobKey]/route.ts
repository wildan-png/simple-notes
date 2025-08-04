import { NextRequest, NextResponse } from 'next/server';
import { supabaseDatabaseService } from '@/lib/database-supabase';

// GET /api/images/[blobKey] - Get an image by blob key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blobKey: string }> }
) {
  try {
    const { blobKey } = await params;
    
    // Validate blob key
    if (!blobKey || blobKey.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid blob key' },
        { status: 400 }
      );
    }
    
    // Get image from Supabase
    const imageBlob = await supabaseDatabaseService.getImage(blobKey);
    
    if (!imageBlob) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Return the image blob
    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': 'image/png', // You might want to detect the actual type
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
} 