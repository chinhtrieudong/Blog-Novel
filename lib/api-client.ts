import {
  ApiResponse,
  AuthRequest,
  AuthResponse,
  ChapterRequest,
  ChapterResponse,
  CommentRequest,
  CommentResponse,
  ForgotPasswordRequest,
  NovelRequest,
  NovelResponse,
  PostRequest,
  PostResponse,
  RefreshTokenRequest,
  ResetPasswordRequest,
  UserRequest,
  UserResponse,
  PagedResponse,
  SearchResultResponse,
  SearchSuggestionResponse,
  AnalyticsDashboardResponse,
  AnalyticsPostsResponse,
  AnalyticsNovelsResponse,
  AnalyticsUsersResponse,
  AnalyticsTrafficResponse,
  NovelQueryParams,
  PostQueryParams,
  SearchParams,
  TokenResponse,
  GenreResponse,
  PaginationParams,
  AuthorRequest,
  AuthorResponse,
} from "@/types/api";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL?: string) {
    // Always use port 8080 for API backend
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";
    console.log("API Base URL:", this.baseURL);
    console.log("Environment API_BASE_URL:", API_BASE_URL);
    console.log("Is client:", typeof window !== "undefined");
    this.loadToken();

    // Test backend connectivity only on client
    if (typeof window !== "undefined") {
      this.testBackendConnection();
    }
  }

  private async testBackendConnection() {
    try {
      console.log("Testing backend connection...");
      const response = await fetch(`${this.baseURL}/posts`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      console.log("Backend test response status:", response.status);
      console.log("Backend test response ok:", response.ok);
    } catch (error) {
      console.error("Backend connection test failed:", error);
    }
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
  }

  private saveToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      this.token = token;
    }
  }

  private removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.token = null;
    }
  }

  private async publicRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(options.body instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
        ...config.headers,
      };
    }

    // Note: No Authorization header added for public requests

    try {
      console.log("Making PUBLIC API request to:", url);
      console.log("Request headers:", config.headers);
      console.log("Request method:", config.method || "GET");
      if (options.body instanceof FormData) {
        console.log("Sending FormData:");
        for (let [key, value] of options.body.entries()) {
          console.log(key, value);
        }
      }

      const response = await fetch(url, config);
      console.log("Response status:", response.status);

      // Check if response has content
      const contentType = response.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (!response.ok) {
        const errorMessage =
          data?.message || `API request failed with status ${response.status}`;
        // For server-side rendering, don't throw auth errors - let caller handle gracefully
        if (response.status === 401) {
          console.log("Authentication required for API access:", errorMessage);
          // Return empty/false response instead of throwing
          return {
            code: 401,
            message: "Authentication required",
            data: null,
          } as any;
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("Public API request error:", error);
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData - browser will set it with boundary
    if (!(options.body instanceof FormData)) {
      config.headers = {
        "Content-Type": "application/json",
        ...config.headers,
      };
    }

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      console.log("Making API request to:", url);
      console.log("Request headers:", config.headers);
      console.log("Request method:", config.method || "GET");
      if (options.body instanceof FormData) {
        console.log("Sending FormData:");
        for (let [key, value] of options.body.entries()) {
          console.log(key, value);
        }
      }

      const response = await fetch(url, config);
      console.log("Response status:", response.status);

      // Check if response has content
      const contentType = response.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (!response.ok) {
        // Handle token expiration (401)
        if (response.status === 401 && this.token) {
          console.log("Token expired, clearing authentication");
          this.removeToken();
          // Dispatch custom event to notify auth context
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:token-expired"));
          }
        }

        const errorMessage =
          data?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData,
    method: string = "POST"
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      method: method,
      headers: {},
      body: formData,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      // Check if response has content
      const contentType = response.headers.get("content-type");
      let data: any = null;

      if (contentType && contentType.includes("application/json")) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          `Upload request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error("Upload request error:", error);
      throw error;
    }
  }

  // Auth API
  async register(data: AuthRequest): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: AuthRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.data.accessToken) {
      this.saveToken(response.data.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  }

  async logout(): Promise<ApiResponse<string>> {
    const response = await this.request<string>("/auth/logout", {
      method: "POST",
    });
    this.removeToken();
    return response;
  }

  async getProfile(): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>("/auth/me");
  }

  async updateProfile(data: UserRequest): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<string>> {
    return this.request<string>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<string>> {
    return this.request<string>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<ApiResponse<TokenResponse>> {
    const response = await this.request<TokenResponse>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.data.accessToken) {
      this.saveToken(response.data.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  }

  // Author API
  async getAuthors(): Promise<ApiResponse<AuthorResponse[]>> {
    return this.request<AuthorResponse[]>("/authors");
  }

  async getAuthorById(id: number): Promise<ApiResponse<AuthorResponse>> {
    return this.request<AuthorResponse>(`/authors/${id}`);
  }

  async createAuthor(
    data: AuthorRequest
  ): Promise<ApiResponse<AuthorResponse>> {
    if (data.avatar) {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      formData.append("avatar", data.avatar);

      return this.uploadRequest<AuthorResponse>("/authors", formData);
    } else {
      return this.request<AuthorResponse>("/authors", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  }

  async updateAuthor(
    id: number,
    data: AuthorRequest
  ): Promise<ApiResponse<AuthorResponse>> {
    if (data.avatar) {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      formData.append("avatar", data.avatar);

      return this.uploadRequest<AuthorResponse>(
        `/authors/${id}`,
        formData,
        "PUT"
      );
    } else {
      return this.request<AuthorResponse>(`/authors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
  }

  async deleteAuthor(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/authors/${id}`, {
      method: "DELETE",
    });
  }

  // Novel API
  async getNovels(
    params?: NovelQueryParams
  ): Promise<ApiResponse<PagedResponse<NovelResponse>>> {
    const searchParams = new URLSearchParams();
    if (params?.title) searchParams.append("title", params.title);
    if (params?.genreId)
      searchParams.append("genreId", params.genreId.toString());
    if (params?.author) searchParams.append("author", params.author);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.size) searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return this.request<PagedResponse<NovelResponse>>(
      `/novels${query ? `?${query}` : ""}`
    );
  }

  async getNovelsByUser(
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<PagedResponse<NovelResponse>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.size) searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return this.request<PagedResponse<NovelResponse>>(
      `/novels/user/${userId}${query ? `?${query}` : ""}`
    );
  }

  async getNovelsByCreator(
    creatorId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<PagedResponse<NovelResponse>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.size) searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return this.request<PagedResponse<NovelResponse>>(
      `/novels/creator/${creatorId}${query ? `?${query}` : ""}`
    );
  }

  async getNovelById(id: number): Promise<ApiResponse<NovelResponse>> {
    return this.request<NovelResponse>(`/novels/${id}`);
  }

  async getRelatedNovels(id: number): Promise<ApiResponse<NovelResponse[]>> {
    return this.request<NovelResponse[]>(`/novels/related/${id}`);
  }

  async createNovel(data: NovelRequest): Promise<ApiResponse<NovelResponse>> {
    if (data.coverImage) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.authorIds) {
        data.authorIds.forEach((id: number) =>
          formData.append("authorIds", id.toString())
        );
      }
      if (data.genreIds) {
        data.genreIds.forEach((id: number) =>
          formData.append("genreIds", id.toString())
        );
      }
      if (data.status) formData.append("status", data.status);
      formData.append("coverImage", data.coverImage);

      return this.uploadRequest<NovelResponse>("/novels", formData);
    } else {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.authorIds) {
        data.authorIds.forEach((id: number) =>
          formData.append("authorIds", id.toString())
        );
      }
      if (data.genreIds) {
        data.genreIds.forEach((id: number) =>
          formData.append("genreIds", id.toString())
        );
      }
      if (data.status) formData.append("status", data.status);

      return this.uploadRequest<NovelResponse>("/novels", formData);
    }
  }

  async createNovelFromFormData(
    formData: FormData
  ): Promise<ApiResponse<NovelResponse>> {
    return this.uploadRequest<NovelResponse>("/novels", formData);
  }

  async updateNovel(
    id: number,
    data: NovelRequest
  ): Promise<ApiResponse<NovelResponse>> {
    if (data.coverImage) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.authorIds) {
        data.authorIds.forEach((id: number) =>
          formData.append("authorIds", id.toString())
        );
      }
      if (data.genreIds) {
        data.genreIds.forEach((genreId: number) =>
          formData.append("genreIds", genreId.toString())
        );
      }
      if (data.status) formData.append("status", data.status);
      formData.append("coverImage", data.coverImage);

      return this.uploadRequest<NovelResponse>(`/novels/${id}`, formData);
    } else {
      return this.request<NovelResponse>(`/novels/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    }
  }

  async updateNovelFromFormData(
    id: number,
    formData: FormData
  ): Promise<ApiResponse<NovelResponse>> {
    return this.uploadRequest<NovelResponse>(`/novels/${id}`, formData);
  }

  async deleteNovel(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/novels/${id}`, {
      method: "DELETE",
    });
  }

  async likeNovel(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/novels/${id}/like`, {
      method: "POST",
    });
  }

  async favoriteNovel(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/novels/${id}/favorite`, {
      method: "POST",
    });
  }

  async rateNovel(id: number, rating: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/novels/${id}/rating?rating=${rating}`, {
      method: "POST",
    });
  }

  async getGenres(): Promise<ApiResponse<GenreResponse[]>> {
    return this.request<GenreResponse[]>("/novels/genres");
  }

  // Chapter API
  async getChapters(novelId: number): Promise<ApiResponse<ChapterResponse[]>> {
    return this.request<ChapterResponse[]>(`/novels/${novelId}/chapters`);
  }

  async getChapterById(
    novelId: number,
    chapterId: number
  ): Promise<ApiResponse<ChapterResponse>> {
    return this.request<ChapterResponse>(
      `/novels/${novelId}/chapters/${chapterId}`
    );
  }

  async createChapter(
    novelId: number,
    data: ChapterRequest
  ): Promise<ApiResponse<ChapterResponse>> {
    return this.request<ChapterResponse>(`/novels/${novelId}/chapters`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateChapter(
    novelId: number,
    chapterId: number,
    data: ChapterRequest
  ): Promise<ApiResponse<ChapterResponse>> {
    return this.request<ChapterResponse>(
      `/novels/${novelId}/chapters/${chapterId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async deleteChapter(
    novelId: number,
    chapterId: number
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/novels/${novelId}/chapters/${chapterId}`, {
      method: "DELETE",
    });
  }

  async incrementChapterViews(
    novelId: number,
    chapterId: number
  ): Promise<ApiResponse<void>> {
    return this.publicRequest<void>(
      `/novels/${novelId}/chapters/${chapterId}/views`,
      {
        method: "POST",
      }
    );
  }

  // Chapter Comment API
  async getChapterComments(
    novelId: number,
    chapterId: number
  ): Promise<ApiResponse<CommentResponse[]>> {
    return this.request<CommentResponse[]>(
      `/novels/${novelId}/chapters/${chapterId}/comments`
    );
  }

  async createChapterComment(
    novelId: number,
    chapterId: number,
    data: CommentRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(
      `/novels/${novelId}/chapters/${chapterId}/comments`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  // Post API
  async getPosts(
    params?: PostQueryParams
  ): Promise<ApiResponse<PagedResponse<PostResponse>>> {
    const searchParams = new URLSearchParams();
    if (params?.title) searchParams.append("title", params.title);
    if (params?.categoryId)
      searchParams.append("categoryId", params.categoryId.toString());
    if (params?.tagId) searchParams.append("tagId", params.tagId.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.size) searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return this.publicRequest<PagedResponse<PostResponse>>(
      `/posts${query ? `?${query}` : ""}`
    );
  }

  async getPostsByUser(
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<PagedResponse<PostResponse>>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.size) searchParams.append("size", params.size.toString());

    const query = searchParams.toString();
    return this.request<PagedResponse<PostResponse>>(
      `/posts/user/${userId}${query ? `?${query}` : ""}`
    );
  }

  async getPostById(id: number): Promise<ApiResponse<PostResponse>> {
    return this.publicRequest<PostResponse>(`/posts/${id}`);
  }

  async createPost(data: PostRequest): Promise<ApiResponse<PostResponse>> {
    if (data.coverImage) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.authorId) formData.append("authorId", data.authorId.toString());
      if (data.status) formData.append("status", data.status);
      if (data.categoryIds) {
        data.categoryIds.forEach((id: number) =>
          formData.append("categoryIds", id.toString())
        );
      }
      if (data.tagIds) {
        data.tagIds.forEach((id: number) =>
          formData.append("tagIds", id.toString())
        );
      }
      formData.append("coverImage", data.coverImage);

      return this.uploadRequest<PostResponse>("/posts", formData);
    } else {
      return this.request<PostResponse>("/posts", {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
  }

  async createPostFromFormData(
    formData: FormData
  ): Promise<ApiResponse<PostResponse>> {
    return this.uploadRequest<PostResponse>("/posts", formData);
  }

  async updatePost(
    id: number,
    data: PostRequest
  ): Promise<ApiResponse<PostResponse>> {
    if (data.coverImage) {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content || "");
      if (data.authorId) formData.append("authorId", data.authorId.toString());
      if (data.status) formData.append("status", data.status);
      if (data.categoryIds) {
        data.categoryIds.forEach((id: number) =>
          formData.append("categoryIds", id.toString())
        );
      }
      if (data.tagIds) {
        data.tagIds.forEach((id: number) =>
          formData.append("tagIds", id.toString())
        );
      }
      formData.append("coverImage", data.coverImage);

      return this.uploadRequest<PostResponse>(`/posts/${id}`, formData);
    } else {
      const updateData = {
        title: data.title,
        content: data.content || "",
        authorId: data.authorId,
        status: data.status,
        categoryIds: data.categoryIds,
        tagIds: data.tagIds,
      };
      return this.request<PostResponse>(`/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
    }
  }

  async updatePostFromFormData(
    id: number,
    formData: FormData
  ): Promise<ApiResponse<PostResponse>> {
    return this.uploadRequest<PostResponse>(`/posts/${id}`, formData, "PUT");
  }

  async deletePost(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${id}`, {
      method: "DELETE",
    });
  }

  async incrementPostViews(id: number): Promise<ApiResponse<void>> {
    return this.publicRequest<void>(`/posts/${id}/views`, {
      method: "POST",
    });
  }

  async incrementNovelViews(id: number): Promise<ApiResponse<void>> {
    return this.publicRequest<void>(`/novels/${id}/views`, {
      method: "POST",
    });
  }

  // Comment API
  async getPostComments(
    postId: number
  ): Promise<ApiResponse<CommentResponse[]>> {
    return this.publicRequest<CommentResponse[]>(`/posts/${postId}/comments`);
  }

  async createPostComment(
    postId: number,
    data: CommentRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(`/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getNovelComments(
    novelId: number
  ): Promise<ApiResponse<CommentResponse[]>> {
    return this.request<CommentResponse[]>(`/novels/${novelId}/comments`);
  }

  async createNovelComment(
    novelId: number,
    data: CommentRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(`/novels/${novelId}/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateComment(
    commentId: number,
    data: CommentRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return this.request<CommentResponse>(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/comments/${commentId}`, {
      method: "DELETE",
    });
  }

  async likeComment(commentId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/comments/${commentId}/like`, {
      method: "POST",
    });
  }

  // User API
  async getUsers(): Promise<ApiResponse<UserResponse[]>> {
    return this.request<UserResponse[]>("/users");
  }

  async getUserById(id: number): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async updateUser(
    id: number,
    data: UserRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async updateUserStatus(
    id: number,
    status: string
  ): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(`/users/${id}/status?status=${status}`, {
      method: "PUT",
    });
  }

  async updateUserRole(
    id: number,
    role: string
  ): Promise<ApiResponse<UserResponse>> {
    return this.request<UserResponse>(`/users/${id}/role?role=${role}`, {
      method: "PUT",
    });
  }

  // Search API
  async search(
    params: SearchParams
  ): Promise<ApiResponse<SearchResultResponse>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.size) searchParams.append("size", params.size.toString());

    return this.request<SearchResultResponse>(
      `/search?${searchParams.toString()}`
    );
  }

  async searchPosts(
    params: SearchParams
  ): Promise<ApiResponse<PagedResponse<PostResponse>>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.size) searchParams.append("size", params.size.toString());

    return this.request<PagedResponse<PostResponse>>(
      `/posts?${searchParams.toString()}`
    );
  }

  async searchNovels(
    params: SearchParams
  ): Promise<ApiResponse<PagedResponse<NovelResponse>>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.size) searchParams.append("size", params.size.toString());

    return this.request<PagedResponse<NovelResponse>>(
      `/search/novels?${searchParams.toString()}`
    );
  }

  async getSearchSuggestions(
    query: string
  ): Promise<ApiResponse<SearchSuggestionResponse>> {
    return this.request<SearchSuggestionResponse>(
      `/search/suggestions?q=${encodeURIComponent(query)}`
    );
  }

  // File Upload API
  async uploadNovelCoverImage(image: File): Promise<ApiResponse<string>> {
    const formData = new FormData();
    formData.append("image", image);
    return this.uploadRequest<string>("/uploads/novels/cover-image", formData);
  }

  async deleteNovelCoverImage(publicId: string): Promise<ApiResponse<string>> {
    return this.request<string>(
      `/uploads/novels/cover-image?publicId=${encodeURIComponent(publicId)}`,
      {
        method: "DELETE",
      }
    );
  }

  // Analytics API (Admin only)
  async getAnalyticsDashboard(): Promise<
    ApiResponse<AnalyticsDashboardResponse>
  > {
    return this.request<AnalyticsDashboardResponse>("/analytics/dashboard");
  }

  async getAnalyticsPosts(): Promise<ApiResponse<AnalyticsPostsResponse>> {
    return this.request<AnalyticsPostsResponse>("/analytics/posts");
  }

  async getAnalyticsNovels(): Promise<ApiResponse<AnalyticsNovelsResponse>> {
    return this.request<AnalyticsNovelsResponse>("/analytics/novels");
  }

  async getAnalyticsUsers(): Promise<ApiResponse<AnalyticsUsersResponse>> {
    return this.request<AnalyticsUsersResponse>("/analytics/users");
  }

  async getAnalyticsTraffic(): Promise<ApiResponse<AnalyticsTrafficResponse>> {
    return this.request<AnalyticsTrafficResponse>("/analytics/traffic");
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.publicRequest<any[]>("/categories");
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export the class for custom instances if needed
export { ApiClient };
