/**
 * Executive by ID API Route
 * Handles GET, PATCH, and DELETE operations for a specific executive
 */

import { NextRequest, NextResponse } from 'next/server';
import { getExecutiveById, updateExecutive, deleteExecutive } from '../store';

// GET /api/executives/:id - Get a specific executive
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const executive = getExecutiveById(id);
    
    if (!executive) {
      return NextResponse.json(
        { error: 'Executive not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(executive, { status: 200 });
  } catch (error: any) {
    console.error('[Executives API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executive', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/executives/:id - Update an executive
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const updated = updateExecutive(id, body);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Executive not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error('[Executives API] PATCH Error:', error);
    return NextResponse.json(
      { error: 'Failed to update executive', details: error.message },
      { status: 400 }
    );
  }
}

// DELETE /api/executives/:id - Delete an executive
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const success = deleteExecutive(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Executive not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Executives API] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete executive', details: error.message },
      { status: 400 }
    );
  }
}

