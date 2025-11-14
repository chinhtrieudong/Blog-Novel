import { NextRequest, NextResponse } from "next/server";
import chapterDataStorage from "@/lib/chapter-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);
    const chapters = await chapterDataStorage.getChaptersByNovelId(novelId);

    return NextResponse.json({ data: chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    const body = await request.json();
    const { title, content, chapterNumber } = body;

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get existing chapters to determine chapter number if not provided
    const existingChapters = await chapterDataStorage.getChaptersByNovelId(
      novelId
    );
    const nextChapterNumber = chapterNumber || existingChapters.length + 1;

    // Calculate word count
    const wordCount = content
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .filter((word: string) => word.length > 0).length;

    const chapterData = {
      novelId,
      title,
      content,
      chapterNumber: nextChapterNumber,
      views: 0,
      likes: 0,
      wordCount,
    };

    const newChapter = await chapterDataStorage.createChapter(chapterData);

    return NextResponse.json({ data: newChapter }, { status: 201 });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
