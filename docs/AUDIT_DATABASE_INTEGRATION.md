# Audit Database Integration - Complete ✅

## Overview
Your PulseHub audit system now **automatically saves all reports to the PostgreSQL database** instead of local files. Every audit creates:
1. ✅ **Audit record** in `pulse_hub_audits` table
2. ✅ **Document metadata** in `user_documents` table  
3. ✅ **Activity log** in `audit_logs` table

---

## What Changed

### ✅ Database Schema Updated
Added columns to `pulse_hub_audits`:
- `overall_score` (INT) - Overall audit score 0-100
- `performance_level` (VARCHAR) - Poor/Moderate/Strong/Excellent
- `grade` (VARCHAR) - Letter grade (A+, A, B+, etc.)
- `topics_audited` (JSONB) - Array of selected topics

### ✅ Audit Manager (`lib/audit/audit-manager.ts`)
- Now accepts `userId` parameter
- Automatically saves audit results to database after completion
- Stores complete audit JSON in `audit_data` JSONB column
- Creates linked document record
- Logs all activity

### ✅ New API Routes

#### Run Audit & Save to DB
```typescript
POST /api/pulsehub/audits
Body: {
  url: "https://example.com",
  topics: ["SEO", "Content Marketing"],
  user_id: 1,  // optional, defaults to 1
  debug: false
}

Response: {
  success: true,
  data: { ...audit result... },
  audit_id: 3,
  document_id: 5,
  message: "Audit completed and saved to database successfully"
}
```

#### List Audits
```typescript
GET /api/pulsehub/audits?user_id=1&limit=10
GET /api/pulsehub/audits?website_url=https://example.com&limit=10

Response: {
  success: true,
  data: [ ...array of audits... ],
  count: 10
}
```

#### Get Single Audit
```typescript
GET /api/pulsehub/audits/[id]

Response: {
  success: true,
  data: { ...audit with full data... }
}
```

#### Download Audit JSON
```typescript
GET /api/pulsehub/audits/[id]/download

Response: audit_3_Test_Audit_example_com.json (downloadable file)
```

#### Delete Audit
```typescript
DELETE /api/pulsehub/audits/[id]

Response: {
  success: true,
  message: "Audit deleted successfully"
}
```

---

## How to Use

### 1. Run Audit (Saves to DB Automatically)
```bash
npm run dev
```

Then make a POST request:
```javascript
const response = await fetch('http://localhost:3000/api/pulsehub/audits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://yourwebsite.com',
    topics: ['SEO', 'Content Marketing', 'Lead Generation'],
    user_id: 1
  })
});

const result = await response.json();
console.log('Audit ID:', result.audit_id);
console.log('Score:', result.data.overall_score);
```

### 2. Retrieve Past Audits
```javascript
// Get all audits for user 1
const response = await fetch('http://localhost:3000/api/pulsehub/audits?user_id=1');
const { data } = await response.json();

data.forEach(audit => {
  console.log(`${audit.audit_name}: ${audit.overall_score}/100 (${audit.grade})`);
});
```

### 3. Get Full Audit Details
```javascript
const response = await fetch('http://localhost:3000/api/pulsehub/audits/3');
const { data } = await response.json();

// Access complete audit data
console.log(data.audit_data.sections);
console.log(data.audit_data.insights_tab);
console.log(data.audit_data.competitor_snapshot);
```

---

## Database Query Helpers

### Direct Database Access
```typescript
import { pulseHubAudits, documents, auditLogs } from '@/lib/db/queries';

// Create audit manually
const audit = await pulseHubAudits.create({
  user_id: 1,
  audit_name: 'Manual Audit',
  website_url: 'https://example.com',
  overall_score: 85,
  performance_level: 'Strong',
  grade: 'B+',
  audit_data: { /* full audit JSON */ },
  topics_audited: ['SEO', 'Content Marketing'],
  status: 'completed'
});

// Find audit by ID
const audit = await pulseHubAudits.findById(3);

// Find audits by user
const userAudits = await pulseHubAudits.findByUser(1, 10);

// Find audits by website
const siteAudits = await pulseHubAudits.findByWebsite('https://example.com', 5);

// Update audit
await pulseHubAudits.update(3, {
  overall_score: 90,
  grade: 'A'
});

// Delete audit
await pulseHubAudits.delete(3);

// Log activity
await auditLogs.log({
  user_id: 1,
  action: 'view_audit',
  module: 'pulsehub',
  resource_type: 'audit',
  resource_id: 3,
  audit_data: { score: 85 }
});
```

---

## What's Stored in Database

### `pulse_hub_audits` Table
```sql
audit_id              | SERIAL    | Primary key
user_id               | INT       | Foreign key to users
audit_name            | VARCHAR   | "Audit - example.com - 11/24/2025"
website_url           | VARCHAR   | "https://example.com"
overall_score         | INT       | 85
performance_level     | VARCHAR   | "Strong"
grade                 | VARCHAR   | "B+"
audit_data            | JSONB     | Complete audit result object
topics_audited        | JSONB     | ["SEO", "Content Marketing"]
status                | VARCHAR   | "completed"
created_at            | TIMESTAMP | Auto
completed_at          | TIMESTAMP | Auto on completion
result_document_id    | INT       | Link to user_documents
```

### `audit_logs` Table
Every action is logged:
```sql
audit_id      | Action          | Module    | Resource Type
1             | create_audit    | pulsehub  | audit
2             | view_audit      | pulsehub  | audit
3             | delete_audit    | pulsehub  | audit
```

---

## Next Steps

### 1. Add Authentication
Replace hardcoded `user_id: 1` with real user from session:
```typescript
import { getServerSession } from 'next-auth';

const session = await getServerSession();
const userId = session.user.id;
```

### 2. Upload PDFs to GCP
Instead of local PDF generation, upload to Google Cloud Storage:
```typescript
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucket = storage.bucket('stackwise-audits');

// Upload PDF
const file = bucket.file(`audits/${audit_id}.pdf`);
await file.save(pdfBuffer);

// Get public URL
const publicUrl = file.publicUrl();

// Save URL to database
await documents.upload({
  user_id: userId,
  document_name: `Audit ${audit_id} PDF`,
  document_type: 'audit_pdf',
  url: publicUrl,
  feature_id: 1,
  file_size: pdfBuffer.length
});
```

### 3. Remove Local File Storage
Once GCP is integrated, remove all local file operations from audit code.

---

## Testing

✅ All tests passed:
- ✅ Audit creation with all fields
- ✅ Audit retrieval by ID
- ✅ Audit listing by user
- ✅ Activity logging
- ✅ Audit deletion

Run `npm run dev` and test with:
```bash
curl -X POST http://localhost:3000/api/pulsehub/audits \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "topics": ["SEO", "Content Marketing"]
  }'
```

---

## Summary

🎉 **Reports now save to database automatically!**

- ✅ No more local file clutter
- ✅ All audits stored in PostgreSQL
- ✅ Complete activity logging
- ✅ RESTful API for retrieval
- ✅ Ready for GCP document storage
- ✅ Full audit history per user
- ✅ Type-safe TypeScript integration

After running `npm run dev`, every audit you run will be permanently stored in the database! 🚀
