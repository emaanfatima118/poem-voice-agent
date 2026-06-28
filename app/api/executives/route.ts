/**
 * Executives API Route
 * Handles CRUD operations for executive profiles
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllExecutives, createExecutive } from './store';

// GET /api/executives - Get all executives
export async function GET(request: NextRequest) {
  try {
    const executives = getAllExecutives();
    return NextResponse.json(executives, { status: 200 });
  } catch (error: any) {
    console.error('[Executives API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executives', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/executives - Create a new executive
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newExecutive = createExecutive(body);
    return NextResponse.json(newExecutive, { status: 201 });
  } catch (error: any) {
    console.error('[Executives API] POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create executive', details: error.message },
      { status: 400 }
    );
  }
}

