# Audit Queue System

## Overview

The Pulse Hub audit system now supports queuing to prevent concurrent execution and ensure proper status tracking. Users can start multiple audits, and they will be processed sequentially.

## Features

### 1. **Status Management**
- **Processing**: Audit is currently being executed
- **Pending**: Audit is waiting in queue for execution
- **Completed**: Audit finished successfully
- **Failed**: Audit encountered errors after 3 retry attempts

### 2. **Queue System**
- Audits are processed one at a time
- New audits are queued with "pending" status
- First audit in empty queue gets "processing" status immediately
- Failed audits automatically retry up to 2 times before marking as failed

### 3. **Real-time Updates**
- View Audits page auto-refreshes every 3 seconds when active audits exist
- Processing status shows spinning icon animation
- Active audits banner displays current processing/pending count

## Implementation

### Database Changes

**Trigger**: Automatically sets `completed_at` timestamp
```sql
-- Run: scripts/2025-12-08_add-audit-completed-trigger.sql
```

### API Endpoints

**POST /api/pulsehub/audits**
- Queues new audit
- Returns: `{ audit_id, status, queue_position }`

**GET /api/pulsehub/audits/queue**
- Get current queue status
- Returns queue length, current audit, pending audits

**GET /api/audits**
- List all audits with status
- Auto-refresh enabled on View Audits page

### Core Components

**audit-queue.ts** (`src/lib/audit/audit-queue.ts`)
- Singleton queue manager
- Handles sequential execution
- Automatic retry logic (max 3 attempts)
- Database status updates

**ViewAudits.tsx**
- Auto-refresh every 3 seconds when active audits
- Active audits banner
- Animated processing icons
- Client-side filtering and pagination

**Audit.tsx**
- Shows queue position on submission
- Redirects to View Audits after queuing
- Toast notifications for status

## User Flow

### Starting an Audit

1. User fills out audit form and clicks "Start Audit"
2. Toast shows: "Audit Processing" or "Audit Queued (position: X)"
3. Audit entry created in database with status
4. User redirected to View Audits page

### Monitoring Progress

1. View Audits page shows all audits with status
2. Active audits banner appears when processing/pending audits exist
3. Page auto-refreshes every 3 seconds
4. Processing audits show spinning icon
5. Completed audits can be clicked to view results

### Queue Behavior

**Scenario 1: Empty Queue**
- Audit immediately starts with "processing" status
- Executes and updates to "completed"

**Scenario 2: Active Queue**
- New audit gets "pending" status
- Queue position shown in toast
- Starts automatically when previous completes

**Scenario 3: Failed Audit**
- Retries up to 2 times
- After 3 attempts, marked as "failed"
- Next audit in queue starts

## Technical Details

### Queue Manager (`AuditQueueManager`)

```typescript
class AuditQueueManager {
  private queue: QueuedAudit[] = [];
  private isProcessing: boolean = false;
  private currentAuditId: number | null = null;

  // Add audit to queue
  async enqueueAudit(options: RunAuditOptions): Promise<number>

  // Process audits sequentially
  private async processQueue(): Promise<void>

  // Execute single audit
  private async executeAudit(auditId: number, options: RunAuditOptions): Promise<AuditResult>

  // Get queue status
  getStatus(): QueueStatus
}
```

### Auto-Refresh Logic

```typescript
refetchInterval: (query) => {
  const hasActiveAudits = query.state.data?.audits?.some(
    (audit: Audit) => audit.status === 'processing' || audit.status === 'pending'
  );
  return hasActiveAudits ? 3000 : false; // 3 seconds
}
```

### Database Trigger

```sql
CREATE OR REPLACE FUNCTION set_audit_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.status IN ('completed', 'failed') AND 
      OLD.status NOT IN ('completed', 'failed')) THEN
    NEW.completed_at = CURRENT_TIMESTAMP;
  END IF
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Configuration

### Retry Settings
- Max retries: 2 (total 3 attempts)
- Located in: `audit-queue.ts` line ~110

### Refresh Interval
- Default: 3000ms (3 seconds)
- Located in: `ViewAudits.tsx` refetchInterval

### Queue Limit
- No hard limit (fetches up to 1000 audits)
- Can be adjusted in ViewAudits query

## Testing

### Test Queue System

1. Start first audit → Should show "Audit Processing"
2. Immediately start second audit → Should show "Audit Queued (position: 1)"
3. Go to View Audits → See both audits, one processing, one pending
4. Wait for first to complete → Second should automatically start
5. Verify statuses update in real-time

### Test Failure Handling

1. Modify audit URL to cause failure
2. Start audit
3. Verify retries in server logs
4. After 3 attempts, status should be "failed"

## Monitoring

### Server Logs
```
[AuditQueue] Enqueued audit 123 with status: processing
[AuditQueue] Processing audit 123...
[AuditQueue] Completed audit 123
[AuditQueue] Queue processing completed
```

### Database Queries
```sql
-- Check audit statuses
SELECT audit_id, audit_name, status, created_at, completed_at 
FROM pulse_hub_audits 
ORDER BY created_at DESC;

-- Find stuck audits (processing > 10 minutes)
SELECT * FROM pulse_hub_audits 
WHERE status = 'processing' 
AND created_at < NOW() - INTERVAL '10 minutes';
```

## Troubleshooting

### Audit Stuck in Processing
- Check server logs for errors
- Restart server to reset queue state
- Manually update status: `UPDATE pulse_hub_audits SET status = 'failed' WHERE audit_id = X;`

### Queue Not Processing
- Verify server is running
- Check console for `[AuditQueue]` logs
- Ensure database connection is active

### Auto-Refresh Not Working
- Open browser console
- Check for React Query errors
- Verify audits have processing/pending status

## Future Enhancements

- [ ] Queue persistence across server restarts
- [ ] Priority queue (urgent audits jump ahead)
- [ ] Concurrent execution (multiple audits in parallel)
- [ ] Progress tracking (percentage complete)
- [ ] Email notification on completion
- [ ] Cancel audit in queue
- [ ] Estimated completion time

## Related Files

- `src/lib/audit/audit-queue.ts` - Queue manager
- `src/stackwise-demo/pages/pulse-hub/Audit.tsx` - Start audit
- `src/stackwise-demo/pages/pulse-hub/ViewAudits.tsx` - View status
- `app/api/pulsehub/audits/route.ts` - Queue audit endpoint
- `app/api/pulsehub/audits/queue/route.ts` - Queue status endpoint
- `scripts/2025-12-08_add-audit-completed-trigger.sql` - DB trigger
