# GTM Models Database Integration (PulseHub)

## Overview

This document describes the database schema and API implementation for storing user-created GTM (Go-To-Market) models persistently. The schema follows the same pattern as other PulseHub tables (e.g., `pulse_hub_audits`, `brand_craft_projects`).

## Database Schema

### Table: `pulse_hub_gtm_model`

Stores user-created GTM models with all configurations and calculated metrics in a single JSONB column.

**Columns:**
- `model_id` (SERIAL PRIMARY KEY) - Unique model identifier
- `user_id` (INT) - Foreign key to `users(userid)`
- `model_name` (VARCHAR(255)) - Model name (unique per user)
- `details` (JSONB) - All model data stored as JSON:
  - `config` - Model configuration (channels, content types, stages, goals, personas, executives, pillars, budget)
  - `kpis` - Calculated KPI values: `{awareness, velocity, efficiency, retention, credibility}`
  - `systemLoad` - System load percentage (integer)
  - `balance` - Balance index percentage (integer)
  - `marketCoverage` - Market coverage percentage (integer)
  - `pipelinePredictability` - Pipeline predictability percentage (integer)
  - `budgetAnalysis` - Budget analysis data
  - `recommendations` - Array of recommendations
  - `warnings` - Array of warning messages
  - `analysis` - Extracted strategic insight text
  - `strategicAnalysis` - Full GPT-generated strategic analysis
  - `archetype` - Optional archetype (e.g., "blitz", "marathon")
  - `description` - Optional model description
  - Any other fields from the frontend model
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp (auto-updated via trigger)

**Constraints:**
- `UNIQUE (user_id, model_name)` - Each user can have unique model names
- Foreign key to `users(userid)` with `ON DELETE CASCADE`

**Indexes:**
- `idx_pulse_hub_gtm_model_user_id` - For fast user queries
- `idx_pulse_hub_gtm_model_created_at` - For sorting by creation date
- `idx_pulse_hub_gtm_model_name` - For name searches

## Migration

Run the migration SQL file to create the table:

```bash
# Option 1: Using psql
psql -U postgres -d stackwise -f lib/db/gtm-models-migration.sql

# Option 2: Using the migrate script (if available)
npm run db:migrate
```

Or manually execute the SQL in `lib/db/gtm-models-migration.sql`.

## TypeScript Types

Types are defined in `lib/db/types.ts`:

- `GTMModel` - Database model interface (matches table structure)
- `CreateGTMModelInput` - Input for creating a model (requires `user_id`, `model_name`, `details`)
- `UpdateGTMModelInput` - Input for updating a model (optional `model_name` and/or `details`)

The `details` field is a JSONB object containing all model data, matching the frontend model structure.

## Database Queries

Query helpers are in `lib/db/queries.ts` under `gtmModels`:

```typescript
import { gtmModels } from '@/lib/db/queries';

// Create a model - all data goes in details
const model = await gtmModels.create({
  user_id: 1,
  model_name: "My GTM Model",
  details: {
    config: { /* ... */ },
    kpis: { awareness: 60, velocity: 50, ... },
    systemLoad: 95,
    balance: 66,
    marketCoverage: 82,
    pipelinePredictability: 53,
    budgetAnalysis: { /* ... */ },
    recommendations: [ /* ... */ ],
    warnings: [ /* ... */ ],
    analysis: "Strategic insight text...",
    strategicAnalysis: { /* ... */ },
    archetype: "blitz",
    description: "Model description",
  }
});

// Get all models for a user
const models = await gtmModels.findByUser(userId);

// Get a single model
const model = await gtmModels.findById(modelId, userId);
// Access data: model.details.kpis, model.details.config, etc.

// Update a model - can update name and/or details (partial merge)
const updated = await gtmModels.update(modelId, userId, {
  model_name: "Updated Name",
  details: {
    kpis: { awareness: 65, ... }, // Only update KPIs, rest stays the same
  }
});

// Delete a model (hard delete)
await gtmModels.delete(modelId, userId);
```

## API Routes

### GET `/api/gtm-models`
Get all models for the current user.

**Query Parameters:**
- `user_id` (required) - User ID (TODO: replace with session/auth)
- `include_inactive` (optional) - Include soft-deleted models

**Response:**
```json
{
  "models": [
    {
      "model_id": 1,
      "user_id": 1,
      "name": "My Model",
      "kpis": { "awareness": 60, ... },
      ...
    }
  ]
}
```

### POST `/api/gtm-models`
Create a new model.

**Request Body:**
```json
{
  "user_id": 1,
  "name": "My Model",
  "details": {
    "config": { /* ... */ },
    "kpis": { "awareness": 60, "velocity": 50, ... },
    "systemLoad": 95,
    "balance": 66,
    "marketCoverage": 82,
    "pipelinePredictability": 53,
    "budgetAnalysis": { /* ... */ },
    "recommendations": [ /* ... */ ],
    "warnings": [ /* ... */ ],
    "analysis": "Strategic insight...",
    "strategicAnalysis": { /* ... */ }
  }
}
```

**Note:** The API also accepts the old format (individual fields) and automatically converts them to the `details` structure for backward compatibility.

**Response:**
```json
{
  "model": { /* created model */ }
}
```

### GET `/api/gtm-models/[id]`
Get a specific model by ID.

**Query Parameters:**
- `user_id` (optional) - User ID for authorization check

**Response:**
```json
{
  "model": { /* model data */ }
}
```

### PUT `/api/gtm-models/[id]`
Update a model.

**Request Body:**
```json
{
  "user_id": 1,
  "name": "Updated Name",
  // ... other fields to update
}
```

**Response:**
```json
{
  "model": { /* updated model */ }
}
```

### DELETE `/api/gtm-models/[id]`
Soft delete a model (sets `is_active = FALSE`).

**Query Parameters:**
- `user_id` (required) - User ID for authorization

**Response:**
```json
{
  "message": "Model deleted successfully"
}
```

## Frontend Integration

To integrate with the frontend, update `pulsehub-GTMtestpit.jsx`:

1. **Replace localStorage with API calls:**
   - On save: POST to `/api/gtm-models`
   - On load: GET from `/api/gtm-models?user_id=X`
   - On delete: DELETE to `/api/gtm-models/[id]`

2. **Data transformation:**
   - Map frontend model structure to API format
   - Handle `model_id` vs `id` differences
   - Convert camelCase to snake_case where needed

3. **Authentication:**
   - Replace `user_id` query parameter with session-based auth
   - Add proper error handling for unauthorized access

## Next Steps

1. **Run the migration:**
   ```bash
   psql -U postgres -d stackwise -f lib/db/gtm-models-migration.sql
   ```

2. **Update frontend:**
   - Replace localStorage with API calls
   - Add loading states
   - Handle errors gracefully

3. **Add authentication:**
   - Integrate with your auth system
   - Replace `user_id` query parameters with session tokens
   - Add authorization checks

4. **Testing:**
   - Test CRUD operations
   - Test unique name constraint
   - Test user isolation (users can't see each other's models)

## Notes

- All model data is stored in a single `details` JSONB column, matching the frontend model structure
- The `updated_at` timestamp is automatically updated via trigger
- Hard deletes are used (no soft delete flag)
- Model names must be unique per user (enforced by database constraint)
- The schema follows the same pattern as other PulseHub tables (`pulse_hub_audits`, `brand_craft_projects`, etc.)
- Frontend can store the entire model object in `details` - no need to map individual fields

