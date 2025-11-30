import { NextRequest, NextResponse } from "next/server";

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

    // For now, simulate user's saved posts
    // In production, this would query a user_saved_posts table in database
    // Mock data: Each user starts with first 3 posts as saved for demo
    // In production, this would query user_saved_posts table from database

    // Forward the request to the external API
    const externalApiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/posts/saved?page=${page}&size=${size}`;

    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `External API responded with status ${response.status}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      {
        code: 500,
        message: "Internal server error",
        data: {
          content: [],
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          last: true,
        },
      },
      { status: 500 }
    );
  }
}
