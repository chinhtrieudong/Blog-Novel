import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";

export async function GET(request: NextRequest) {
  try {
    // Get current user from authentication
    const authHeader = request.headers.get("authorization");
    let currentUserId = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token.startsWith("mock_access_token_")) {
        currentUserId = parseInt(token.split("_")[3]);
      }
    }

    if (!currentUserId) {
      return NextResponse.json(
        { code: 401, message: "Authentication required", data: [] },
        { status: 401 }
      );
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    // For now, simulate user's favorites
    // In production, this would query a user_favorites table in database
    const allNovels = await novelDataStorage.getAllNovels();

    // Mock data: Each user starts with first 3 novels as favorites for demo
    // In production, this would query user_favorites table from database
    const userFavorites = allNovels.slice(0, 3); // Mock data

    // Note: In a real app, favorites would be stored per user in database
    // For demo purposes, we use consistent mock data

    // Filter by pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedFavorites = userFavorites.slice(startIndex, endIndex);

    // Transform to API response format
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
      message: "User favorites retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
