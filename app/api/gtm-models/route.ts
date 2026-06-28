/**
 * GTM Models API Route
 * Handles CRUD operations for user GTM models
 */

import { NextRequest, NextResponse } from 'next/server';
import { gtmModels } from '@/lib/db/queries';
import type { CreateGTMModelInput, UpdateGTMModelInput } from '@/lib/db/types';

// GET /api/gtm-models - Get all models for the current user
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user_id from session/auth token
    // For now, using a query parameter (replace with proper auth)
    const searchParams = request.nextUrl.searchParams;
    const userId = parseInt(searchParams.get('user_id') || '0');
    
    if (!userId || userId <= 0) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const models = await gtmModels.findByUser(userId);

    // Transform database models to frontend format
    const transformedModels = models.map(model => ({
      id: `model-${model.model_id}`, // Frontend expects string ID
      model_id: model.model_id,
      name: model.model_name,
      createdAt: model.created_at,
      ...model.details, // Spread all details (config, kpis, etc.)
    }));

    return NextResponse.json({ models: transformedModels }, { status: 200 });
  } catch (error: any) {
    console.error('[GTM Models API] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/gtm-models - Create a new model
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Get user_id from session/auth token
    const userId = body.user_id;
    if (!userId || userId <= 0) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // All model data goes into details JSONB column
    const modelData: CreateGTMModelInput = {
      user_id: userId,
      model_name: body.name || body.model_name,
      details: {
        // Store all frontend model data as-is
        config: body.config,
        kpis: body.kpis,
        systemLoad: body.system_load || body.systemLoad,
        balance: body.balance_index || body.balance,
        marketCoverage: body.market_coverage || body.marketCoverage,
        pipelinePredictability: body.pipeline_predictability || body.pipelinePredictability,
        budgetAnalysis: body.budget_analysis || body.budgetAnalysis,
        recommendations: body.recommendations,
        warnings: body.warnings,
        analysis: body.analysis,
        strategicAnalysis: body.strategic_analysis || body.strategicAnalysis,
        archetype: body.archetype,
        description: body.description,
        // Include any other fields from the frontend model
        ...(body.details || {}),
      },
    };

    const model = await gtmModels.create(modelData);

    // Transform to frontend format
    const transformedModel = {
      id: `model-${model.model_id}`,
      model_id: model.model_id,
      name: model.model_name,
      createdAt: model.created_at,
      ...model.details,
    };

    return NextResponse.json({ model: transformedModel }, { status: 201 });
  } catch (error: any) {
    console.error('[GTM Models API] POST Error:', error);
    
    // Handle unique constraint violation (duplicate name)
    if (error.message?.includes('unique_user_model_name')) {
      return NextResponse.json(
        { error: 'A model with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create model', details: error.message },
      { status: 500 }
    );
  }
}

