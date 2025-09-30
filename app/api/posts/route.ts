import { NextRequest, NextResponse } from "next/server";

// Mock posts data
const MOCK_POSTS = [
  {
    id: 1,
    title: "Giới thiệu về Next.js 15",
    content:
      "Next.js 15 là một framework React mạnh mẽ với nhiều tính năng mới...",
    excerpt:
      "Next.js 15 là một framework React mạnh mẽ với nhiều tính năng mới...",
    slug: "gioi-thieu-ve-nextjs-15",
    coverImageUrl: "/placeholder.svg",
    status: "published",
    author: {
      id: 4,
      username: "chinh1",
      email: "lebachinh1@gmail.com",
      fullName: null,
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2025-09-25T03:00:24Z",
      updatedAt: "2025-09-25T15:06:50Z",
    },
    categories: [{ id: 1, name: "Công nghệ", slug: "cong-nghe" }],
    tags: [
      { id: 1, name: "Next.js", slug: "nextjs" },
      { id: 2, name: "React", slug: "react" },
    ],
    views: 150,
    likes: 25,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    publishedAt: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Hướng dẫn sử dụng Tailwind CSS",
    content: "Tailwind CSS là một utility-first CSS framework...",
    excerpt: "Tailwind CSS là một utility-first CSS framework...",
    slug: "huong-dan-su-dung-tailwind-css",
    coverImageUrl: "/placeholder.svg",
    status: "published",
    author: {
      id: 4,
      username: "chinh1",
      email: "lebachinh1@gmail.com",
      fullName: null,
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: "2025-09-25T03:00:24Z",
      updatedAt: "2025-09-25T15:06:50Z",
    },
    categories: [{ id: 1, name: "Công nghệ", slug: "cong-nghe" }],
    tags: [
      { id: 3, name: "CSS", slug: "css" },
      { id: 4, name: "Tailwind", slug: "tailwind" },
    ],
    views: 89,
    likes: 12,
    createdAt: "2025-01-10T14:20:00Z",
    updatedAt: "2025-01-10T14:20:00Z",
    publishedAt: "2025-01-10T14:20:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const title = searchParams.get("title");

    let filteredPosts = MOCK_POSTS;

    // Filter by title if provided
    if (title) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      code: 200,
      message: "Posts fetched successfully",
      data: {
        content: paginatedPosts,
        totalElements: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / size),
        size,
        number: page,
        first: page === 0,
        last: endIndex >= filteredPosts.length,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
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
