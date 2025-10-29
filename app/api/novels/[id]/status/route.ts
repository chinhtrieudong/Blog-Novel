import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = parseInt(params.id);
    if (isNaN(novelId)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid novel ID",
          data: null,
        },
        { status: 400 }
      );
    }

    // Check if novel exists
    const existingNovel = await novelDataStorage.getNovelById(novelId);
    if (!existingNovel) {
      return NextResponse.json(
        {
          code: 404,
          message: "Novel not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Get the new status from query parameters
    const { searchParams } = new URL(request.url);
    const newStatus = searchParams.get("status");

    // Validate status
    const validStatuses = ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"];
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

    // Update novel status
    const updates: any = {
      status: newStatus,
    };

    // If publishing, set publishDate timestamp
    if (newStatus === "PUBLISHED" && existingNovel.status !== "PUBLISHED") {
      updates.publishDate = new Date().toISOString();
    }

    const updatedNovel = await novelDataStorage.updateNovel(novelId, updates);

    if (!updatedNovel) {
      return NextResponse.json(
        {
          code: 500,
          message: "Failed to update novel status",
          data: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: "Novel status updated successfully",
      data: updatedNovel,
    });
  } catch (error) {
    console.error("Update novel status error:", error);
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
