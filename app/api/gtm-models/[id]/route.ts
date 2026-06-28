/**
 * GTM Model by ID API Route
 * Handles GET, PUT, DELETE operations for a specific model
 */

import { NextRequest, NextResponse } from 'next/server';
import { gtmModels } from '@/lib/db/queries';
import type { UpdateGTMModelInput } from '@/lib/db/types';

// GET /api/gtm-models/[id] - Get a specific model
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modelId = parseInt(id);
    if (!modelId || modelId <= 0) {
      return NextResponse.json(
        { error: 'Invalid model ID' },
        { status: 400 }
      );
    }

    // TODO: Get user_id from session/auth token
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get('user_id') || '0');

    const model = await gtmModels.findById(modelId, userId || undefined);

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    // Transform to frontend format
    const transformedModel = {
      id: `model-${model.model_id}`,
      model_id: model.model_id,
      name: model.model_name,
      createdAt: model.created_at,
      ...model.details,
    };

    return NextResponse.json({ model: transformedModel }, { status: 200 });
  } catch (error: any) {
    console.error('[GTM Models API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/gtm-models/[id] - Update a model
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modelId = parseInt(id);
    if (!modelId || modelId <= 0) {
      return NextResponse.json(
        { error: 'Invalid model ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // TODO: Get user_id from session/auth token
    const userId = body.user_id;
    if (!userId || userId <= 0) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Update model_name and/or details
    const updateData: UpdateGTMModelInput = {
      ...(body.name || body.model_name ? { model_name: body.name || body.model_name } : {}),
      ...(body.details ? { details: body.details } : {
        // If updating individual fields, merge into details
        details: {
          ...(body.config ? { config: body.config } : {}),
          ...(body.kpis ? { kpis: body.kpis } : {}),
          ...(body.system_load || body.systemLoad ? { systemLoad: body.system_load || body.systemLoad } : {}),
          ...(body.balance_index || body.balance ? { balance: body.balance_index || body.balance } : {}),
          ...(body.market_coverage || body.marketCoverage ? { marketCoverage: body.market_coverage || body.marketCoverage } : {}),
          ...(body.pipeline_predictability || body.pipelinePredictability ? { pipelinePredictability: body.pipeline_predictability || body.pipelinePredictability } : {}),
          ...(body.budget_analysis || body.budgetAnalysis ? { budgetAnalysis: body.budget_analysis || body.budgetAnalysis } : {}),
          ...(body.recommendations ? { recommendations: body.recommendations } : {}),
          ...(body.warnings ? { warnings: body.warnings } : {}),
          ...(body.analysis ? { analysis: body.analysis } : {}),
          ...(body.strategic_analysis || body.strategicAnalysis ? { strategicAnalysis: body.strategic_analysis || body.strategicAnalysis } : {}),
          ...(body.archetype ? { archetype: body.archetype } : {}),
          ...(body.description ? { description: body.description } : {}),
        },
      }),
    };

    const model = await gtmModels.update(modelId, userId, updateData);

    // Transform to frontend format
    const transformedModel = {
      id: `model-${model.model_id}`,
      model_id: model.model_id,
      name: model.model_name,
      createdAt: model.created_at,
      ...model.details,
    };

    return NextResponse.json({ model: transformedModel }, { status: 200 });
  } catch (error: any) {
    console.error('[GTM Models API] PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update model', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/gtm-models/[id] - Delete (soft delete) a model
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const modelId = parseInt(id);
    if (!modelId || modelId <= 0) {
      return NextResponse.json(
        { error: 'Invalid model ID' },
        { status: 400 }
      );
    }

    // TODO: Get user_id from session/auth token
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get('user_id') || '0');
    
    if (!userId || userId <= 0) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await gtmModels.delete(modelId, userId);

    return NextResponse.json(
      { message: 'Model deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[GTM Models API] DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete model', details: error.message },
      { status: 500 }
    );
  }
}

