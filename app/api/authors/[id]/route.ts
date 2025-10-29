import { NextRequest, NextResponse } from "next/server";
import authorDataStorage from "@/lib/author-data-storage";
import { AuthorRequest, AuthorResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid author ID",
          data: null,
        },
        { status: 400 }
      );
    }

    const author = await authorDataStorage.getAuthorById(id);
    if (!author) {
      return NextResponse.json(
        {
          code: 404,
          message: "Author not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const authorResponse: AuthorResponse = {
      id: author.id,
      name: author.name,
      bio: author.bio,
      avatarUrl: author.avatarUrl,
    };

    return NextResponse.json({
      code: 200,
      message: "Author retrieved successfully",
      data: authorResponse,
    });
  } catch (error) {
    console.error("Get author error:", error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid author ID",
          data: null,
        },
        { status: 400 }
      );
    }

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

    const updatedAuthor = await authorDataStorage.updateAuthor(id, authorData);
    if (!updatedAuthor) {
      return NextResponse.json(
        {
          code: 404,
          message: "Author not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const authorResponse: AuthorResponse = {
      id: updatedAuthor.id,
      name: updatedAuthor.name,
      bio: updatedAuthor.bio,
      avatarUrl: updatedAuthor.avatarUrl,
    };

    return NextResponse.json({
      code: 200,
      message: "Author updated successfully",
      data: authorResponse,
    });
  } catch (error) {
    console.error("Update author error:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid author ID",
          data: null,
        },
        { status: 400 }
      );
    }

    const deleted = await authorDataStorage.deleteAuthor(id);
    if (!deleted) {
      return NextResponse.json(
        {
          code: 404,
          message: "Author not found",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: 200,
      message: "Author deleted successfully",
    });
  } catch (error) {
    console.error("Delete author error:", error);
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
