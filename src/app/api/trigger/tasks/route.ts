import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/trigger/tasks
 * Trigger various tasks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskType, payload } = body;

    let result;

    switch (taskType) {
      case "hello-world":
        result = {
          id: `run-${Date.now()}`,
          taskId: "hello-world",
          status: "QUEUED",
        };
        break;

      case "save-document":
        result = {
          id: `run-${Date.now()}`,
          taskId: "save-document",
          status: "QUEUED",
          payload: {
            roomId: payload?.roomId || "room-1",
            userId: payload?.userId || "user-1",
            title: payload?.title || "Untitled Document",
            content: payload?.content || "",
            tags: payload?.tags || [],
          },
        };
        break;

      case "log-activity":
        result = {
          id: `run-${Date.now()}`,
          taskId: "log-activity",
          status: "QUEUED",
          payload: {
            roomId: payload?.roomId || "room-1",
            userId: payload?.userId || "user-1",
            action: payload?.action || "edit",
            metadata: payload?.metadata || {},
          },
        };
        break;

      default:
        return NextResponse.json(
          { error: "Unknown task type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      run: result,
      message: `Task "${taskType}" triggered successfully`,
    });
  } catch (error) {
    console.error("Error triggering task:", error);
    return NextResponse.json(
      {
        error: "Failed to trigger task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/trigger/status
 * Get task execution status
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const runId = searchParams.get("runId");

  if (!runId) {
    return NextResponse.json(
      { error: "Missing runId parameter" },
      { status: 400 }
    );
  }

  try {
    // In a real implementation, you would fetch the run status from Trigger.dev
    return NextResponse.json({
      success: true,
      runId,
      status: "in-progress",
      message: "Task is executing...",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch task status" },
      { status: 500 }
    );
  }
}
