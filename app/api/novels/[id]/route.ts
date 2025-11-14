import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";
import chapterDataStorage from "@/lib/chapter-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);
    const novel = await novelDataStorage.getNovelById(novelId);

    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Count actual chapters for this novel
    const chapters = await chapterDataStorage.getChaptersByNovelId(novelId);
    const actualChapterCount = chapters.length;

    // Transform to API response format matching NovelResponse interface
    const response = {
      id: novel.id,
      title: novel.title,
      description: novel.description,
      author: {
        id: novel.author_id || 1,
        name: novel.author,
        bio: "Tác giả nổi tiếng",
        avatarUrl: `/placeholder.svg`,
      },
      genres: novel.genre ? [{ id: 1, name: novel.genre }] : [],
      status: novel.status,
      coverImage: novel.cover.startsWith("http")
        ? novel.cover
        : `/placeholder.svg`,
      totalChapters: actualChapterCount,
      totalViews: novel.views,
      totalLikes: novel.likes,
      avgRating: novel.rating,
      createdAt: novel.createdAt || novel.publishDate,
      updatedAt: novel.updatedAt || novel.lastUpdate,
      lastChapterUpdate: novel.lastUpdate,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("Error fetching novel:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
