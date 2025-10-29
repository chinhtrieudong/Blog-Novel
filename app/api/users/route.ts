import { NextRequest, NextResponse } from "next/server";
import userDataStorage from "@/lib/user-data-storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    // Get all users from storage
    const allUsers = await userDataStorage.getAllUsers();
    let filteredUsers = allUsers;

    // Filter by name if provided
    if (name) {
      filteredUsers = allUsers.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(name.toLowerCase()) ||
          user.username.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter by email if provided
    if (email) {
      filteredUsers = allUsers.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    // Pagination
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      code: 200,
      message: "Users fetched successfully",
      data: {
        content: paginatedUsers,
        totalElements: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / size),
        size,
        number: page,
        first: page === 0,
        last: endIndex >= filteredUsers.length,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
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
    const username = formData.get("username")
      ? String(formData.get("username"))
      : "";
    const email = formData.get("email") ? String(formData.get("email")) : "";
    const fullName = formData.get("fullName")
      ? String(formData.get("fullName"))
      : "";
    const role = formData.get("role") ? String(formData.get("role")) : "USER";
    const status = formData.get("status")
      ? String(formData.get("status"))
      : "ACTIVE";

    // Create new user object
    const newUserData = {
      username,
      email,
      fullName,
      role,
      status,
    };

    // Save to storage
    const newUser = await userDataStorage.createUser(newUserData);

    return NextResponse.json({
      code: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Create user error:", error);
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
