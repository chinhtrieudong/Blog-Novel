import { NextRequest, NextResponse } from "next/server";
import novelDataStorage, { Novel } from "@/lib/novel-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    // Check if novel exists
    const novel = await novelDataStorage.getNovelById(novelId);
    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // For now, return mock related novels
    // In production, this would query a relationship table
    const allNovels = await novelDataStorage.getAllNovels();

    // Simulate related novels by filtering by same genre or author
    let relatedNovels = allNovels.filter((n: Novel) => {
      // Don't include the current novel
      if (n.id === novelId) return false;

      // Related by genre
      if (n.genre === novel.genre) return true;

      // Related by author (different novels by same author)
      if (n.author === novel.author) return true;

      return false;
    });

    // Limit results and add some random related novels if not enough
    if (relatedNovels.length < 5) {
      const otherNovels = allNovels.filter(
        (n: Novel) =>
          n.id !== novelId && !relatedNovels.some((r: Novel) => r.id === n.id)
      );

      // Add up to 5 more random novels
      const toAdd = otherNovels.slice(0, 5 - relatedNovels.length);
      relatedNovels = [...relatedNovels, ...toAdd];
    }

    // Apply pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedNovels = relatedNovels.slice(startIndex, endIndex);

    // Transform to response format matching backend structure
    const responseData = paginatedNovels.map((n: Novel) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      author: {
        id: n.author_id || 1,
        name: n.author || "Tác giả ẩn danh",
        bio: "Tác giả nổi tiếng",
        avatarUrl: "/placeholder.svg",
      },
      genres: n.genre ? [{ id: 1, name: n.genre }] : [],
      status: n.status,
      coverImage: n.cover.startsWith("http") ? n.cover : "/placeholder.svg",
      totalChapters: n.chapters,
      viewCount: n.views,
      totalLikes: n.likes,
      avgRating: n.rating,
      createdAt: n.createdAt || n.publishDate,
      updatedAt: n.updatedAt || n.lastUpdate,
      lastChapterUpdate: n.lastUpdate,
    }));

    return NextResponse.json({
      code: 200,
      message: "Related novels retrieved successfully",
      data: {
        content: responseData,
        page,
        size,
        totalElements: relatedNovels.length,
        totalPages: Math.ceil(relatedNovels.length / size),
        last: page >= Math.ceil(relatedNovels.length / size) - 1,
      },
    });
  } catch (error) {
    console.error("Error fetching related novels:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
