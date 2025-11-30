import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    // For now, simulate user's favorites
    // In production, this would query a user_favorites table in database
    const allNovels = await novelDataStorage.getAllNovels();

    // Simulate some novels as favorites for this user
    // In real implementation, query user's favorite novels from database
    const userFavorites = allNovels.slice(0, 5); // Mock - first 5 novels as favorites

    // Filter by user if there's any logic, but for now return mock data
    const filteredFavorites = userFavorites.filter(
      (novel) => novel.id && novel.title // Basic validation
    );

    // Apply pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedFavorites = filteredFavorites.slice(startIndex, endIndex);

    // Transform to response format
    const responseData = paginatedFavorites.map((novel) => ({
      id: novel.id,
      title: novel.title,
      description: novel.description,
      author: {
        id: novel.author_id || 1,
        name: novel.author || "Tác giả ẩn danh",
        bio: "Tác giả nổi tiếng",
        avatarUrl: "/placeholder.svg",
      },
      genres: novel.genre ? [{ id: 1, name: novel.genre }] : [],
      status: novel.status,
      coverImage: novel.cover.startsWith("http")
        ? novel.cover
        : "/placeholder.svg",
      totalChapters: novel.chapters,
      viewCount: novel.views,
      totalLikes: novel.likes,
      avgRating: novel.rating,
      createdAt: novel.createdAt || novel.publishDate,
      updatedAt: novel.updatedAt || novel.lastUpdate,
      lastChapterUpdate: novel.lastUpdate,
    }));

    return NextResponse.json({
      code: 200,
      message: `Found ${filteredFavorites.length} favorite novels for user ${userId}`,
      data: {
        content: responseData,
        page,
        size,
        totalElements: filteredFavorites.length,
        totalPages: Math.ceil(filteredFavorites.length / size),
        last: page >= Math.ceil(filteredFavorites.length / size) - 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
