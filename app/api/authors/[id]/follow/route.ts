import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate author ID
    const authorId = parseInt(id);
    if (isNaN(authorId)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid author ID",
          data: null,
        },
        { status: 400 }
      );
    }

    // Forward the follow request to the external API backend
    const externalApiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/authors/${id}/follow`;

    const authHeader = request.headers.get("authorization");

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        {
          code: response.status,
          message: errorData?.message || `Follow request failed`,
          data: null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Follow author error:", error);
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
    const id = params.id;

    // Validate author ID
    const authorId = parseInt(id);
    if (isNaN(authorId)) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid author ID",
          data: null,
        },
        { status: 400 }
      );
    }

    // Forward the unfollow request to the external API backend
    const externalApiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/authors/${id}/follow`;

    const authHeader = request.headers.get("authorization");

    const response = await fetch(externalApiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        {
          code: response.status,
          message: errorData?.message || `Unfollow request failed`,
          data: null,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unfollow author error:", error);
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
