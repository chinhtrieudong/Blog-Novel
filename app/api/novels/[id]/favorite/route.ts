import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    // Check if novel exists
    const novel = await novelDataStorage.getNovelById(novelId);
    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // In production, this would:
    // 1. Check if user is authenticated
    // 2. Add/remove novel to user's favorites in database
    // 3. Return appropriate response

    // For now, return success with mock message
    return NextResponse.json({
      code: 200,
      message: "Novel favorited successfully",
      data: {
        novelId,
        favorited: true, // In real implementation, this would toggle based on current state
      },
    });
  } catch (error) {
    console.error("Error favoriting novel:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to check if novel is favorited by current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    // Check if novel exists
    const novel = await novelDataStorage.getNovelById(novelId);
    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // In production, this would check if the current user has favorited this novel
    // For now, return mock response
    return NextResponse.json({
      code: 200,
      message: "Favorite status retrieved",
      data: {
        novelId,
        isFavorited: false, // Mock - would check user's favorites
      },
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
