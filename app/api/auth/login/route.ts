import { NextRequest, NextResponse } from "next/server";

// Mock user data for development
const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // In real app, this would be hashed
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Find user by username
    const user = MOCK_USERS.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json(
        {
          code: 401,
          message: "Invalid username or password",
          data: null,
        },
        { status: 401 }
      );
    }

    // Check password (in real app, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        {
          code: 401,
          message: "Invalid username or password",
          data: null,
        },
        { status: 401 }
      );
    }

    // Generate mock tokens
    const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
    const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      code: 200,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
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
