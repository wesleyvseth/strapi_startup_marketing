import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Simple webhook endpoint for Strapi cache invalidation
 * POST /api/cache/revalidate
 *
 * This endpoint should be called by Strapi webhooks when content is updated
 */
export async function POST(request: NextRequest) {
  try {
    // Basic auth check (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;

    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate all Strapi-related cache
    revalidateTag("strapi");
    revalidateTag("seo");

    return NextResponse.json({
      success: true,
      message: "Cache invalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cache revalidation error:", error);

    return NextResponse.json(
      {
        error: "Failed to invalidate cache",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
  return NextResponse.json({
    message: "Strapi webhook endpoint for cache invalidation",
    usage: "POST to this endpoint from Strapi webhooks to invalidate cache",
    setup: {
      "1": "Add STRAPI_WEBHOOK_SECRET to your environment variables",
      "2": "Configure Strapi webhook to POST to /api/cache/revalidate",
      "3": "Include 'Authorization: Bearer YOUR_SECRET' header in webhook",
    },
  });
}
