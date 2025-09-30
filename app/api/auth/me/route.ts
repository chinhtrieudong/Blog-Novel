import { NextRequest, NextResponse } from "next/server";

// Mock current user storage (in real app, this would be from JWT token)
let currentUser: any = null;

export async function GET(request: NextRequest) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          code: 401,
          message: "Unauthorized",
          data: null,
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Mock token validation (in real app, validate JWT)
    if (!token.startsWith("mock_access_token_")) {
      return NextResponse.json(
        {
          code: 401,
          message: "Invalid token",
          data: null,
        },
        { status: 401 }
      );
    }

    // Extract user ID from token (mock)
    const userId = parseInt(token.split("_")[3]);

    // Mock users data
    const MOCK_USERS = [
      {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        password: "admin123",
        fullName: "Administrator",
        role: "ADMIN",
        status: "ACTIVE",
        avatarUrl: null,
        bio: null,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      {
        id: 2,
        username: "user",
        email: "user@example.com",
        password: "user123",
        fullName: "Regular User",
        role: "USER",
        status: "ACTIVE",
        avatarUrl: null,
        bio: null,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
      {
        id: 4,
        username: "chinh1",
        email: "lebachinh1@gmail.com",
        password: "password123",
        fullName: null,
        role: "ADMIN",
        status: "ACTIVE",
        avatarUrl: null,
        bio: null,
        createdAt: "2025-09-25T03:00:24Z",
        updatedAt: "2025-09-25T15:06:50Z",
      },
    ];

    const user = MOCK_USERS.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json(
        {
          code: 404,
          message: "User not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Store current user for other endpoints
    currentUser = user;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      code: 200,
      message: "Current user fetched successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Get profile error:", error);
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

// Helper function to get current user (for other API routes)
export function getCurrentUser() {
  return currentUser;
}
