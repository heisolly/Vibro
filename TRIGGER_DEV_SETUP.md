# Trigger.dev Setup Guide

## 📦 What's Installed

- `@trigger.dev/sdk@4.4.6` - Core SDK
- `@trigger.dev/build@4.4.6` - Build tools
- Project: LUTER (`proj_cjdnvdvpcwgoespajimp`)

## 🗂️ Project Structure

```
src/trigger/
├── example.ts          # Basic tasks
├── scheduled-tasks.ts  # Cron and webhook-triggered tasks
```

## 📋 Tasks Created

### Basic Tasks (src/trigger/example.ts)

1. **hello-world** - Simple demonstration task
2. **save-document** - Save collaborative documents to database
3. **log-activity** - Log collaborative activities
4. **send-notification** - Send email/SMS/in-app notifications
5. **process-batch** - Process items in batches
6. **sync-data** - Synchronize data between services
7. **generate-report** - Generate analytics reports
8. **cleanup-old-data** - Clean up old documents and logs
9. **health-check** - Monitor system health
10. **export-data** - Export user data and documents

### Scheduled Tasks (src/trigger/scheduled-tasks.ts)

#### Cron Jobs
- **daily-health-check** - Runs daily at 2 AM UTC
- **weekly-cleanup** - Runs every Monday at 3 AM UTC
- **monthly-report** - Runs first day of month at 4 AM UTC

#### Webhook-Triggered Tasks
- **on-document-saved** - Triggered when document is saved
- **on-collaboration-started** - Triggered when users start collaborating
- **on-user-joined-room** - Triggered when user joins a room
- **on-error-alert** - Triggered on system errors
- **on-data-sync** - Triggered for data synchronization
- **on-batch-import** - Triggered for bulk imports
- **on-export-request** - Triggered for export requests

## 🚀 Getting Started

### 1. Start the Development Server
```bash
npx trigger.dev@latest dev
```

This will:
- Start watching for task file changes
- Connect to your Trigger.dev project
- Create a tunnel for webhook events
- Display a live dashboard

### 2. View the Dashboard
Visit: https://cloud.trigger.dev/projects/v3/proj_cjdnvdvpcwgoespajimp

### 3. Trigger Tasks Manually (from your app)

```typescript
// Call the API endpoint
const response = await fetch('/api/trigger/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    taskType: 'save-document',
    payload: {
      roomId: 'room-123',
      userId: 'user-456',
      title: 'My Document',
      content: 'Document content...',
      tags: ['important', 'review']
    }
  })
});

const result = await response.json();
console.log(result.run); // Contains run ID
```

## 📝 Task Examples

### Trigger a Basic Task
```typescript
import { helloWorldTask } from "@trigger.dev/sdk/v3";

// From your app
const run = await helloWorldTask.trigger({ 
  message: "Hello from Vibro!" 
});

console.log("Run ID:", run.id);
```

### Trigger Document Save Task
```typescript
import { saveDocumentTask } from "@/trigger/example";

const run = await saveDocumentTask.trigger({
  roomId: "room-abc123",
  userId: "user-xyz789",
  title: "Quarterly Report",
  content: "Document content...",
  tags: ["report", "q3"]
});
```

### Trigger Notification
```typescript
import { sendNotificationTask } from "@/trigger/example";

const run = await sendNotificationTask.trigger({
  userId: "user-123",
  type: "email",
  title: "Document Ready",
  message: "Your collaborative document is ready for review"
});
```

## 🔄 Triggering via Webhooks

### Trigger Event-Based Task
```typescript
// From your app
const response = await fetch('/api/trigger/events', {
  method: 'POST',
  body: JSON.stringify({
    name: 'document.saved',
    data: {
      roomId: 'room-123',
      userId: 'user-456',
      title: 'My Document',
      content: 'Content...'
    }
  })
});
```

### Emit Custom Events
```typescript
import { logger } from "@trigger.dev/sdk/v3";

// In your task
logger.info("Custom event", { 
  eventName: "document.saved",
  data: { roomId, userId }
});
```

## ⏰ Cron Job Examples

### Cron Expression Format
```
┌───────────── second (0 - 59) [optional]
│ ┌───────────── minute (0 - 59)
│ │ ┌───────────── hour (0 - 23)
│ │ │ ┌───────────── day of month (1 - 31)
│ │ │ │ ┌───────────── month (1 - 12)
│ │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │ │
│ │ │ │ │ │
* * * * * *
```

### Common Cron Patterns
```typescript
// Every day at 2 AM UTC
cron("0 2 * * *")

// Every Monday at 3 AM UTC
cron("0 3 * * 1")

// First day of month at 4 AM UTC
cron("0 4 1 * *")

// Every 6 hours
cron("0 */6 * * *")

// Every 30 minutes
cron("*/30 * * * *")

// Every weekday at 9 AM UTC
cron("0 9 * * 1-5")
```

## 🔧 Configuration

### trigger.config.ts
```typescript
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_cjdnvdvpcwgoespajimp", // Your project ID
  runtime: "node",
  logLevel: "log",
  maxDuration: 3600, // Max 1 hour per task
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
});
```

## 📊 Logging

### Available Logging Methods
```typescript
import { logger } from "@trigger.dev/sdk/v3";

logger.log("Message");           // Standard log
logger.info("Info message");     // Info level
logger.error("Error occurred");  // Error level
logger.warn("Warning message");  // Warning level

// With metadata
logger.log("Event", { userId: "123", action: "edit" });

// Error logging
try {
  // code
} catch (error) {
  logger.error("Error details", { error, context: {...} });
}
```

## 🔄 Retries & Error Handling

### Task Retry Configuration
```typescript
export const myTask = task({
  id: "my-task",
  maxDuration: 600,
  run: async (payload) => {
    try {
      // Task logic
      return result;
    } catch (error) {
      logger.error("Task failed", { error });
      throw error; // Will trigger retry
    }
  }
});
```

### Manual Retry
```typescript
import { retry } from "@trigger.dev/sdk/v3";

export const retryableTask = task({
  id: "retryable-task",
  run: async (payload) => {
    return await retry(
      async () => {
        // Logic that might fail
      },
      {
        maxAttempts: 5,
        delay: 1000,
      }
    );
  }
});
```

## 🧪 Testing Tasks

### Local Testing
```bash
# Start dev server
npx trigger.dev@latest dev

# Your tasks are now executable
```

### Trigger from Dashboard
1. Go to https://cloud.trigger.dev/projects/v3/proj_cjdnvdvpcwgoespajimp
2. Navigate to "Test" tab for a task
3. Enter payload and click "Run"

### Trigger Programmatically
```typescript
const run = await myTask.trigger({ 
  /* payload */ 
});

// Check status
console.log(run.id); // Run ID
console.log(run.status); // "QUEUED" | "EXECUTING" | "COMPLETED" | "FAILED"
```

## 📈 Monitoring & Debugging

### View Live Logs
- Open Trigger.dev dashboard
- Select a task run
- View real-time logs and metrics

### Common Issues

1. **Task not running**
   - Ensure `npx trigger.dev@latest dev` is running
   - Check task file syntax
   - Verify trigger.config.ts points to correct directory

2. **Webhook not received**
   - Check event name matches exactly
   - Verify payload schema
   - Look at logs in Trigger.dev dashboard

3. **Task timeout**
   - Increase `maxDuration` in task config
   - Optimize task logic for performance
   - Split long tasks into smaller ones

## 🚀 Deployment

### Deploying to Production
```bash
# Build your project first
npm run build

# Deploy to Trigger.dev cloud
npx trigger.dev@latest deploy
```

### Environment Variables
Add to production environment:
```env
TRIGGER_API_KEY=your_api_key_here
TRIGGER_PROJECT_ID=proj_cjdnvdvpcwgoespajimp
```

## 📚 Useful Resources

- [Trigger.dev Docs](https://trigger.dev/docs)
- [SDK Reference](https://trigger.dev/docs/sdk/v3)
- [Dashboard](https://cloud.trigger.dev)
- [Discord Community](https://trigger.dev/discord)
- [GitHub](https://github.com/triggerdotdev/trigger.dev)

## 🔗 Integration with Supabase & Liveblocks

### Save Liveblocks Data to Supabase
```typescript
export const autosaveTask = task({
  id: "autosave-liveblocks",
  run: async (payload: { roomId: string }) => {
    // Fetch from Liveblocks
    const data = await liveblocks.getRoom(payload.roomId);
    
    // Save to Supabase
    const { error } = await supabase
      .from('documents')
      .upsert({ room_id: payload.roomId, ...data });
    
    if (error) throw error;
    return { saved: true };
  }
});
```

### Sync Events Between Services
```typescript
export const syncEventsTask = task({
  id: "sync-events",
  trigger: cron("0 * * * *"), // Every hour
  run: async () => {
    // Get activity from Supabase
    const activities = await supabase
      .from('activities')
      .select('*')
      .not('synced', 'is', true);
    
    // Process and notify via Liveblocks
    for (const activity of activities) {
      await notifyCollaborators(activity);
    }
    
    return { synced: activities.length };
  }
});
```

## 📞 Support

For issues or questions:
- [Trigger.dev Discord](https://trigger.dev/discord)
- [Email Support](mailto:help@trigger.dev)
- [GitHub Issues](https://github.com/triggerdotdev/trigger.dev/issues)
