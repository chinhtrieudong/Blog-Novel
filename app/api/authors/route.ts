import { NextRequest, NextResponse } from "next/server";
import authorDataStorage from "@/lib/author-data-storage";
import { AuthorResponse, AuthorRequest } from "@/types/api";

export async function GET(request: NextRequest) {
  try {
    const authors = await authorDataStorage.getAllAuthors();

    const authorResponses: AuthorResponse[] = authors.map((author) => ({
      id: author.id,
      name: author.name,
      bio: author.bio,
      avatarUrl: author.avatarUrl,
    }));

    return NextResponse.json({
      code: 200,
      message: "All authors retrieved successfully",
      data: authorResponses,
    });
  } catch (error) {
    console.error("Get authors error:", error);
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
    const contentType = request.headers.get("content-type") || "";

    let body: AuthorRequest;

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (when avatar is uploaded)
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const bio = formData.get("bio") as string;
      const avatar = formData.get("avatar") as File | null;

      body = { name, bio: bio || undefined, avatar: avatar || undefined };
    } else {
      // Handle JSON (when no avatar)
      body = await request.json();
    }

    // Validate required fields
    if (!body.name || body.name.length < 2 || body.name.length > 255) {
      return NextResponse.json(
        {
          code: 400,
          message: "Name is required and must be between 2-255 characters",
          data: null,
        },
        { status: 400 }
      );
    }

    // Handle avatar upload if present
    let avatarUrl = "";
    if (body.avatar && body.avatar instanceof File && body.avatar.size > 0) {
      // In a real app, you would upload the image to a storage service
      avatarUrl = "/placeholder.svg"; // Placeholder for now
    }

    const authorData = {
      name: body.name,
      bio: body.bio,
      avatarUrl,
    };

    const newAuthor = await authorDataStorage.createAuthor(authorData);

    const authorResponse: AuthorResponse = {
      id: newAuthor.id,
      name: newAuthor.name,
      bio: newAuthor.bio,
      avatarUrl: newAuthor.avatarUrl,
    };

    return NextResponse.json({
      code: 201,
      message: "Author created successfully",
      data: authorResponse,
    });
  } catch (error) {
    console.error("Create author error:", error);
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
