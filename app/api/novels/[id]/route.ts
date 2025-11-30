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
      viewCount: novel.views,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const novelId = parseInt(id);

    if (isNaN(novelId)) {
      return NextResponse.json(
        { code: 400, message: "Invalid novel ID" },
        { status: 400 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let updateData: any = {};

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (when cover image might be uploaded)
      const formData = await request.formData();

      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const authorIdsJson = formData.get("authorIds") as string;
      const genreIdsJson = formData.get("genreIds") as string;
      const status = formData.get("status") as string;
      const coverImage = formData.get("coverImage") as File;

      // Parse JSON arrays
      const authorIds = authorIdsJson ? JSON.parse(authorIdsJson) : [];
      const genreIds = genreIdsJson ? JSON.parse(genreIdsJson) : [];

      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;

      // Handle multiple authors - for now, use the first author as main author
      if (authorIds.length > 0) {
        // Get author details for the first author
        const authorDataStorage = await import("@/lib/author-data-storage");
        const allAuthors = await authorDataStorage.default.getAllAuthors();
        const mainAuthor = allAuthors.find((a) => a.id === authorIds[0]);
        if (mainAuthor) {
          updateData.author_id = mainAuthor.id;
          updateData.author = mainAuthor.name; // for backwards compatibility
        }
      }

      // Handle multiple genres - for now, use the first genre ID as genre name
      if (genreIds.length > 0) {
        // For simplicity, use genre ID as name for now
        // In a real app, you'd look up the genre name from a genres table
        updateData.genre = `Genre ${genreIds[0]}`;
      }

      if (status) updateData.status = status;
      if (coverImage && coverImage.size > 0) {
        // In a real app, you would upload the image to a storage service
        updateData.coverImage = "/placeholder.svg"; // Placeholder for now
      }
    } else {
      // Handle JSON (when no file upload)
      updateData = await request.json();
    }

    // Validate required fields
    if (!updateData.title || updateData.title.length < 1) {
      return NextResponse.json(
        { code: 400, message: "Title is required" },
        { status: 400 }
      );
    }

    // Update the novel in storage
    const updatedNovel = await novelDataStorage.updateNovel(
      novelId,
      updateData
    );

    if (!updatedNovel) {
      return NextResponse.json(
        { code: 404, message: "Novel not found" },
        { status: 404 }
      );
    }

    // Count actual chapters for this novel after update
    const chapters = await chapterDataStorage.getChaptersByNovelId(novelId);
    const actualChapterCount = chapters.length;

    // Transform to API response format
    const response = {
      id: updatedNovel.id,
      title: updatedNovel.title,
      description: updatedNovel.description,
      author: {
        id: updatedNovel.author_id || 1,
        name: updatedNovel.author,
      },
      genres: updatedNovel.genre ? [{ id: 1, name: updatedNovel.genre }] : [],
      status: updatedNovel.status,
      coverImageUrl: updatedNovel.cover.startsWith("http")
        ? updatedNovel.cover
        : `/placeholder.svg`,
      viewCount: updatedNovel.views,
      likeCount: updatedNovel.likes,
      rating: updatedNovel.rating,
      chapterCount: actualChapterCount,
      createdAt: updatedNovel.createdAt || updatedNovel.publishDate,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      code: 200,
      message: "Novel updated successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error updating novel:", error);
    return NextResponse.json(
      { code: 500, message: "Internal server error" },
      { status: 500 }
    );
  }
}
