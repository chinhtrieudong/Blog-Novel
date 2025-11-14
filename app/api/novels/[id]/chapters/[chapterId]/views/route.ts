import { NextRequest, NextResponse } from "next/server";
import chapterDataStorage from "@/lib/chapter-data-storage";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const resolvedParams = await params;
    const chapterId = parseInt(resolvedParams.chapterId);

    const updatedChapter = await chapterDataStorage.incrementViews(chapterId);

    if (!updatedChapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updatedChapter });
  } catch (error) {
    console.error("Error incrementing chapter views:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
