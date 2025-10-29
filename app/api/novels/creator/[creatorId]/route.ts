import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";
import authorDataStorage from "@/lib/author-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { creatorId: string } }
) {
  try {
    const creatorId = parseInt(params.creatorId);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    // Get all novels from storage
    const allNovels = await novelDataStorage.getAllNovels();

    // Filter novels by creator (author_id)
    const creatorNovels = allNovels.filter(
      (novel) => novel.author_id === creatorId
    );

    // Populate authors for response
    const allAuthors = await authorDataStorage.getAllAuthors();
    const novelResponses = creatorNovels.map((novel) => {
      const authorEntity = novel.author_id
        ? allAuthors.find((a) => a.id === novel.author_id)
        : null;

      return {
        id: novel.id,
        title: novel.title,
        description: novel.description,
        author: authorEntity
          ? {
              id: authorEntity.id,
              name: authorEntity.name,
              bio: authorEntity.bio,
              avatarUrl: authorEntity.avatarUrl,
            }
          : null,
        genre: novel.genre,
        chapters: novel.chapters,
        status: novel.status,
        rating: novel.rating,
        reviews: novel.reviews,
        views: novel.views,
        likes: novel.likes,
        lastUpdate: novel.lastUpdate,
        cover: novel.cover,
        tags: novel.tags,
        publishDate: novel.publishDate,
        totalWords: novel.totalWords,
        averageChapterLength: novel.averageChapterLength,
        coverImageUrl: novel.cover,
        totalViews: novel.views,
        totalChapters: novel.chapters,
        updatedAt: novel.updatedAt || novel.lastUpdate,
      };
    });

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedNovels = novelResponses.slice(startIndex, endIndex);

    return NextResponse.json({
      code: 200,
      message: "Creator novels fetched successfully",
      data: {
        content: paginatedNovels,
        totalElements: creatorNovels.length,
        totalPages: Math.ceil(creatorNovels.length / size),
        size,
        number: page,
        first: page === 0,
        last: endIndex >= creatorNovels.length,
      },
    });
  } catch (error) {
    console.error("Get creator novels error:", error);
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
