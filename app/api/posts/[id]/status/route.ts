import { NextRequest, NextResponse } from "next/server";
import dataStorage from "@/lib/data-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    if (isNaN(postId)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid post ID",
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await dataStorage.getPostById(postId);
    if (!existingPost) {
      return NextResponse.json(
        {
          code: 404,
          message: "Post not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Get the new status from query parameters
    const { searchParams } = new URL(request.url);
    const newStatus = searchParams.get("status");

    // Validate status
    const validStatuses = ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED"];
    if (!newStatus || !validStatuses.includes(newStatus)) {
      return NextResponse.json(
        {
          code: 400,
          message: `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
          data: null,
        },
        { status: 400 }
      );
    }

    // Update post status
    const updates: any = {
      status: newStatus,
    };

    // If publishing, set publishedAt timestamp
    if (newStatus === "PUBLISHED" && existingPost.status !== "PUBLISHED") {
      updates.publishedAt = new Date().toISOString();
    }

    const updatedPost = await dataStorage.updatePost(postId, updates);

    if (!updatedPost) {
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to update post status",
          data: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: "Post status updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error("Update post status error:", error);
    return NextResponse.json(
      {
        code: 500,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
