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
    status: "draft",
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
  {
    id: 3,
    title: "Bí quyết viết blog hiệu quả",
    content: "Để viết được một bài blog thu hút độc giả...",
    excerpt: "Để viết được một bài blog thu hút độc giả...",
    slug: "bi-quyet-viet-blog-hieu-qua",
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
    categories: [{ id: 2, name: "Đời sống", slug: "doi-song" }],
    tags: [
      { id: 5, name: "Blog", slug: "blog" },
      { id: 6, name: "Viết lách", slug: "viet-lach" },
    ],
    views: 234,
    likes: 45,
    createdAt: "2025-01-05T09:15:00Z",
    updatedAt: "2025-01-05T09:15:00Z",
    publishedAt: "2025-01-05T09:15:00Z",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");

    // Filter posts by user ID
    const userPosts = MOCK_POSTS.filter((post) => post.author.id === userId);

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedPosts = userPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      code: 200,
      message: "User posts fetched successfully",
      data: {
        content: paginatedPosts,
        totalElements: userPosts.length,
        totalPages: Math.ceil(userPosts.length / size),
        size,
        number: page,
        first: page === 0,
        last: endIndex >= userPosts.length,
      },
    });
  } catch (error) {
    console.error("Get user posts error:", error);
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
