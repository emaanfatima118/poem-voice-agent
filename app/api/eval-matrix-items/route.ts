import { NextRequest, NextResponse } from 'next/server';

const DEMO_SERVER_URL = process.env.DEMO_SERVER_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${DEMO_SERVER_URL}/api/eval-matrix-items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching eval matrix items:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch eval matrix items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${DEMO_SERVER_URL}/api/eval-matrix-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error creating eval matrix item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create eval matrix item' },
      { status: 500 }
    );
  }
}
