import { NextRequest, NextResponse } from "next/server";
import novelDataStorage from "@/lib/novel-data-storage";
import authorDataStorage from "@/lib/author-data-storage";
import chapterDataStorage from "@/lib/chapter-data-storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const title = searchParams.get("title");
    const author = searchParams.get("author");

    // Check for authorization header
    const authHeader = request.headers.get("authorization");
    let currentUser = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token.startsWith("mock_access_token_")) {
        const userId = parseInt(token.split("_")[3]);

        const MOCK_USERS = [
          {
            id: 1,
            username: "admin",
            email: "admin@example.com",
            role: "ADMIN",
          },
          {
            id: 2,
            username: "user",
            email: "user@example.com",
            role: "USER",
          },
          {
            id: 4,
            username: "chinh1",
            email: "lebachinh1@gmail.com",
            role: "ADMIN",
          },
        ];

        currentUser = MOCK_USERS.find((u) => u.id === userId) || null;
      }
    }

    // Get all novels from storage
    const allNovels = await novelDataStorage.getAllNovels();
    let filteredNovels = allNovels;

    if (!currentUser) {
      filteredNovels = allNovels.filter(
        (novel) => novel.status === "PUBLISHED"
      );
    } else if (currentUser.role !== "ADMIN") {
      filteredNovels = allNovels.filter(
        (novel) =>
          novel.status === "PUBLISHED" || novel.author === currentUser.username
      );
    }

    // Filter by title if provided
    if (title) {
      filteredNovels = filteredNovels.filter((novel) =>
        novel.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Filter by author if provided
    if (author) {
      const allAuthors = await authorDataStorage.getAllAuthors();
      const authorNames = author.toLowerCase();

      filteredNovels = filteredNovels.filter((novel) => {
        if (novel.author_id) {
          const authorEntity = allAuthors.find((a) => a.id === novel.author_id);
          return (
            authorEntity &&
            authorEntity.name.toLowerCase().includes(authorNames)
          );
        } else if (novel.author) {
          // fallback for old data
          return novel.author.toLowerCase().includes(authorNames);
        }
        return false;
      });
    }

    // Get all chapters to count them per novel
    const allChapters = await chapterDataStorage.getAllChapters();

    // Populate authors for response
    const allAuthors = await authorDataStorage.getAllAuthors();
    const novelResponses = filteredNovels.map((novel) => {
      const authorEntity = novel.author_id
        ? allAuthors.find((a) => a.id === novel.author_id)
        : null;

      // Count actual chapters for this novel
      const actualChapterCount = allChapters.filter(
        (chapter) => chapter.novelId === novel.id
      ).length;

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
        genres: [], // TODO: implement genres
        status: novel.status,
        coverImage: novel.cover,
        totalChapters: actualChapterCount,
        totalViews: novel.views,
        totalLikes: novel.likes,
        avgRating: novel.rating,
        createdAt: novel.publishDate,
        updatedAt: novel.updatedAt || novel.lastUpdate,
        lastChapterUpdate: novel.lastUpdate,
      };
    });

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedNovels = novelResponses.slice(startIndex, endIndex);

    return NextResponse.json({
      code: 200,
      message: "Novels fetched successfully",
      data: {
        content: paginatedNovels,
        totalElements: filteredNovels.length,
        totalPages: Math.ceil(filteredNovels.length / size),
        size,
        number: page,
        first: page === 0,
        last: endIndex >= filteredNovels.length,
      },
    });
  } catch (error) {
    console.error("Get novels error:", error);
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract data from FormData
    const title = formData.get("title") ? String(formData.get("title")) : "";
    const description = formData.get("description")
      ? String(formData.get("description"))
      : "";
    const genre = formData.get("genre") ? String(formData.get("genre")) : "";
    const status = formData.get("status")
      ? String(formData.get("status"))
      : "DRAFT";

    // Extract arrays
    const authorIds = formData
      .getAll("authorIds")
      .map((id) => parseInt(String(id)))
      .filter((id) => !isNaN(id));
    const tags = formData
      .getAll("tags")
      .map((tag) => String(tag))
      .filter((tag) => tag.length > 0);

    // Handle cover image if present
    const coverImage = formData.get("coverImage") as File | null;
    let coverImageUrl = "/placeholder.svg";

    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      // In a real app, you would upload the image to a storage service
      coverImageUrl = "/placeholder.svg";
    }

    // Validate required fields
    if (!title.trim()) {
      return NextResponse.json(
        {
          code: 400,
          message: "Title is required",
          data: null,
        },
        { status: 400 }
      );
    }

    if (authorIds.length === 0) {
      return NextResponse.json(
        {
          code: 400,
          message: "At least one author is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get authors
    const allAuthors = await authorDataStorage.getAllAuthors();
    const authors = authorIds.map((id) => {
      const author = allAuthors.find((a) => a.id === id);
      if (!author) {
        throw new Error(`Author with id ${id} not found`);
      }
      return author;
    });

    // For now, use the first author as the main author (since the data model seems to support one author)
    const mainAuthor = authors[0];

    // Create new novel object
    const newNovelData = {
      title,
      author_id: mainAuthor.id,
      author: mainAuthor.name, // keep for backwards compatibility during migration
      description,
      genre,
      chapters: 0,
      status,
      rating: 0,
      reviews: 0,
      views: 0,
      likes: 0,
      lastUpdate: new Date().toISOString(),
      cover: coverImageUrl,
      tags,
      publishDate: new Date().toISOString(),
      totalWords: 0,
      averageChapterLength: 0,
    };

    // Save to storage
    const newNovel = await novelDataStorage.createNovel(newNovelData);

    // Transform response
    const novelResponse = {
      id: newNovel.id,
      title: newNovel.title,
      description: newNovel.description,
      author: {
        id: mainAuthor.id,
        name: mainAuthor.name,
        bio: mainAuthor.bio,
        avatarUrl: mainAuthor.avatarUrl,
      },
      genre: newNovel.genre,
      chapters: newNovel.chapters,
      status: newNovel.status,
      rating: newNovel.rating,
      reviews: newNovel.reviews,
      views: newNovel.views,
      likes: newNovel.likes,
      lastUpdate: newNovel.lastUpdate,
      cover: newNovel.cover,
      tags: newNovel.tags,
      publishDate: newNovel.publishDate,
      totalWords: newNovel.totalWords,
      averageChapterLength: newNovel.averageChapterLength,
    };

    return NextResponse.json({
      code: 201,
      message: "Novel created successfully",
      data: novelResponse,
    });
  } catch (error) {
    console.error("Create novel error:", error);
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
