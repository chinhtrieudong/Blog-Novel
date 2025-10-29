import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "10");
    const title = searchParams.get("title");
    const search = searchParams.get("q");

    // Build query parameters for external API
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    if (title) queryParams.append("title", title);
    if (search) queryParams.append("q", search);

    // Fetch from external API
    const externalApiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/posts?${queryParams.toString()}`;

    const response = await fetch(externalApiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`External API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Filter to only show published posts
    let filteredPosts = data.data.content || [];
    filteredPosts = filteredPosts.filter(
      (post: any) => post.status === "PUBLISHED"
    );

    // Update the response with filtered data
    const filteredResponse = {
      ...data,
      data: {
        ...data.data,
        content: filteredPosts,
        totalElements: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / size),
      },
    };

    return NextResponse.json(filteredResponse);
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

export async function POST(request: NextRequest) {
  try {
    // Forward the request to the external API
    const externalApiUrl = `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"
    }/posts`;

    // Get the form data from the request
    const formData = await request.formData();

    // Forward the form data to the external API
    const response = await fetch(externalApiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `External API responded with status ${response.status}`
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create post error:", error);
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
