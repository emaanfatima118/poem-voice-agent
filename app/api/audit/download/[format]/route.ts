import { NextRequest, NextResponse } from 'next/server';

/**
 * Download API - Redirects to GCS URL
 * Files are now stored in Google Cloud Storage
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  try {
    const { format } = await params;
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url') || searchParams.get('filename');

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required',
        },
        { status: 400 }
      );
    }

    // If it's already a full URL (GCS), redirect to it
    if (url.startsWith('http')) {
      return NextResponse.redirect(url);
    }

    // Otherwise, return error
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid file URL',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[download API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
