import { NextRequest, NextResponse } from "next/server";
import commentDataStorage from "@/lib/comment-data-storage";
import novelDataStorage from "@/lib/novel-data-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const novelId = parseInt(params.id);
    const comments = await commentDataStorage.getCommentsByNovelId(novelId);

    return NextResponse.json({ data: comments });
  } catch (error) {
    console.error("Error fetching novel comments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Mock authentication like in novels route
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
            avatarUrl: "/placeholder.svg",
          },
          {
            id: 2,
            username: "user",
            email: "user@example.com",
            avatarUrl: "/placeholder.svg",
          },
          {
            id: 4,
            username: "chinh1",
            email: "lebachinh1@gmail.com",
            avatarUrl: "/placeholder.svg",
          },
        ];

        currentUser = MOCK_USERS.find((u) => u.id === userId) || null;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const novelId = parseInt(params.id);
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { message: "Comment content is required" },
        { status: 400 }
      );
    }

    const novels = await novelDataStorage.getAllNovels();

    // Check if novel exists
    const novel = novels.find((n) => n.id === novelId);
    if (!novel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    const newComment = await commentDataStorage.createComment({
      content: content.trim(),
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
      },
      novelId,
      likes: 0,
    });

    return NextResponse.json({ data: newComment }, { status: 201 });
  } catch (error) {
    console.error("Error creating novel comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
