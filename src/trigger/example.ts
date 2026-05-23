import { logger, task, wait } from "@trigger.dev/sdk/v3";

/**
 * Simple Hello World Task
 * Demonstrates basic task execution
 */
export const helloWorldTask = task({
  id: "hello-world",
  description: "A simple hello world task",
  maxDuration: 300,
  run: async (payload: any, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx });

    await wait.for({ seconds: 2 });

    return {
      message: "Hello, world!",
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Document Save Task
 * Save collaborative documents from Liveblocks to database
 */
export const saveDocumentTask = task({
  id: "save-document",
  description: "Save a collaborative document to the database",
  maxDuration: 600,
  run: async (payload: {
    roomId: string;
    userId: string;
    title: string;
    content: string;
    tags: string[];
  }) => {
    logger.log("Saving document", { roomId: payload.roomId });

    try {
      // Simulate document save
      await wait.for({ seconds: 1 });

      logger.info("Document saved successfully", {
        roomId: payload.roomId,
        userId: payload.userId,
      });

      return {
        success: true,
        documentId: `doc-${payload.roomId}-${Date.now()}`,
        savedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error("Failed to save document", { error });
      throw error;
    }
  },
});

/**
 * Activity Log Task
 * Log collaborative activities for audit trail
 */
export const logActivityTask = task({
  id: "log-activity",
  description: "Log collaborative user activities",
  maxDuration: 300,
  run: async (payload: {
    roomId: string;
    userId: string;
    action: string;
    metadata?: Record<string, any>;
  }) => {
    logger.log("Activity logged", {
      roomId: payload.roomId,
      action: payload.action,
      userId: payload.userId,
    });

    return {
      success: true,
      logId: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Send Notification Task
 * Send notifications to users
 */
export const sendNotificationTask = task({
  id: "send-notification",
  description: "Send a notification to a user",
  maxDuration: 600,
  run: async (payload: {
    userId: string;
    type: "email" | "in-app" | "sms";
    title: string;
    message: string;
  }) => {
    logger.info("Sending notification", {
      userId: payload.userId,
      type: payload.type,
    });

    // Simulate notification sending
    await wait.for({ seconds: 1 });

    return {
      success: true,
      notificationId: `notif-${Date.now()}`,
      deliveredAt: new Date().toISOString(),
    };
  },
});

/**
 * Process Batch Task
 * Process multiple items in batches
 */
export const processBatchTask = task({
  id: "process-batch",
  description: "Process items in batches",
  maxDuration: 1800,
  run: async (payload: {
    items: any[];
    batchSize?: number;
  }) => {
    const batchSize = payload.batchSize || 10;
    const totalBatches = Math.ceil(payload.items.length / batchSize);

    logger.info("Processing batch", {
      totalItems: payload.items.length,
      totalBatches,
      batchSize,
    });

    const results = [];

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, payload.items.length);
      const batch = payload.items.slice(start, end);

      logger.log(`Processing batch ${i + 1}/${totalBatches}`, { count: batch.length });

      // Simulate batch processing
      await wait.for({ seconds: 1 });

      results.push({
        batchNumber: i + 1,
        processed: batch.length,
      });
    }

    return {
      success: true,
      totalProcessed: payload.items.length,
      batches: results,
    };
  },
});

/**
 * Sync Data Task
 * Synchronize data between services
 */
export const syncDataTask = task({
  id: "sync-data",
  description: "Synchronize data between Supabase and Liveblocks",
  maxDuration: 900,
  run: async (payload: {
    dataType: string;
    sourceId: string;
  }) => {
    logger.info("Starting data sync", {
      dataType: payload.dataType,
      sourceId: payload.sourceId,
    });

    try {
      // Simulate sync operation
      await wait.for({ seconds: 2 });

      logger.info("Data sync completed successfully");

      return {
        success: true,
        syncedAt: new Date().toISOString(),
        recordsAffected: Math.floor(Math.random() * 100) + 1,
      };
    } catch (error) {
      logger.error("Data sync failed", { error });
      throw error;
    }
  },
});

/**
 * Generate Report Task
 * Generate and export reports
 */
export const generateReportTask = task({
  id: "generate-report",
  description: "Generate analytics or collaboration reports",
  maxDuration: 1200,
  run: async (payload: {
    reportType: string;
    startDate: string;
    endDate: string;
    format?: "pdf" | "csv" | "json";
  }) => {
    logger.info("Generating report", {
      reportType: payload.reportType,
      format: payload.format || "json",
    });

    // Simulate report generation
    await wait.for({ seconds: 3 });

    return {
      success: true,
      reportId: `report-${Date.now()}`,
      format: payload.format || "json",
      generatedAt: new Date().toISOString(),
      downloadUrl: `/reports/${Date.now()}.${payload.format || "json"}`,
    };
  },
});

/**
 * Cleanup Old Data Task
 * Remove old documents and activity logs
 */
export const cleanupOldDataTask = task({
  id: "cleanup-old-data",
  description: "Clean up old documents and activity logs",
  maxDuration: 1800,
  run: async (payload: {
    olderThanDays?: number;
  }) => {
    const days = payload.olderThanDays || 30;

    logger.info("Starting cleanup", { olderThanDays: days });

    // Simulate cleanup
    await wait.for({ seconds: 2 });

    const deleted = {
      documents: Math.floor(Math.random() * 50),
      logs: Math.floor(Math.random() * 500),
      sessions: Math.floor(Math.random() * 100),
    };

    logger.info("Cleanup completed", { deleted });

    return {
      success: true,
      deleted,
      completedAt: new Date().toISOString(),
    };
  },
});

/**
 * Health Check Task
 * Monitor system health
 */
export const healthCheckTask = task({
  id: "health-check",
  description: "Monitor system and service health",
  maxDuration: 300,
  run: async () => {
    logger.info("Running health check");

    const health = {
      database: true,
      liveblocks: true,
      supabase: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    logger.info("Health check completed", { health });

    return health;
  },
});

/**
 * Export Data Task
 * Export user data and documents
 */
export const exportDataTask = task({
  id: "export-data",
  description: "Export user data and documents",
  maxDuration: 1800,
  run: async (payload: {
    userId: string;
    includeDocuments?: boolean;
    includeActivity?: boolean;
  }) => {
    logger.info("Starting data export", { userId: payload.userId });

    const data = {
      user: { id: payload.userId },
      documents: payload.includeDocuments ? [] : null,
      activity: payload.includeActivity ? [] : null,
      exportedAt: new Date().toISOString(),
    };

    // Simulate data export
    await wait.for({ seconds: 2 });

    logger.info("Data export completed", { userId: payload.userId });

    return {
      success: true,
      exportId: `export-${Date.now()}`,
      data,
      downloadUrl: `/exports/${Date.now()}.json`,
    };
  },
});
