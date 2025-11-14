import { NextRequest, NextResponse } from "next/server";
import chapterDataStorage from "@/lib/chapter-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; chapterId: string } }
) {
  try {
    const chapterId = parseInt(params.chapterId);
    const chapter = await chapterDataStorage.getChapterById(chapterId);

    if (!chapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: chapter });
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
