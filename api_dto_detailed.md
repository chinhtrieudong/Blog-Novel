# Danh sách các API và DTO chi tiết với các fields

## Request DTOs

### 1. AuthRequest

```java
{
    "email": "string (optional)",
    "username": "string (required, 3-50 chars)",
    "password": "string (required, min 6 chars)"
}
```

### 2. ChapterRequest

```java
{
    "title": "string (required, 5-255 chars)",
    "content": "string (required)",
    "chapterNumber": "integer (optional)"
}
```

### 3. CommentRequest

```java
{
    "content": "string (required, 1-1000 chars)",
    "parentId": "long (optional, for replies)"
}
```

### 4. ForgotPasswordRequest

```java
{
    "email": "string (required, valid email format)"
}
```

### 5. NovelRequest

```java
{
    "title": "string (required, 5-255 chars)",
    "description": "string (required, min 10 chars)",
    "authorId": "long (optional)",
    "genreIds": "Set<Long> (optional)",
    "status": "NovelStatus enum (optional)",
    "coverImage": "MultipartFile (optional)"
}
```

### 6. PostRequest

```java
{
    "title": "string (required, 5-255 chars)",
    "content": "string (required, min 10 chars)",
    "coverImage": "MultipartFile (optional)",
    "authorId": "long (optional)",
    "status": "string (optional)",
    "categoryIds": "Set<Long> (optional)",
    "tagIds": "Set<Long> (optional)"
}
```

### 7. RefreshTokenRequest

```java
{
    "refreshToken": "string"
}
```

### 8. ResetPasswordRequest

```java
{
    "token": "string (required)",
    "newPassword": "string (required, min 6 chars)"
}
```

### 9. UserRequest

```java
{
    "username": "string (required, 3-50 chars)",
    "email": "string (required, valid email)",
    "fullName": "string (required, 3-100 chars)",
    "bio": "string (optional, max 255 chars)",
    "avatarUrl": "string (optional)"
}
```

## Response DTOs

### 1. ApiResponse<T>

```java
{
    "code": "int (default: 200)",
    "message": "string (default: 'Success')",
    "data": "T (generic type)"
}
```

### 2. AuthResponse

```java
{
    "accessToken": "string",
    "refreshToken": "string"
}
```

## API Endpoints với DTO chi tiết

### 1. **AuthController** (`/api/auth`)

- **POST /api/auth/register**  
  Request Body: `AuthRequest`

  ```json
  {
    "email": "user@example.com",
    "username": "username123",
    "password": "password123"
  }
  ```

  Response: `ApiResponse<UserResponse>`

- **POST /api/auth/login**  
  Request Body: `AuthRequest`

  ```json
  {
    "username": "username123",
    "password": "password123"
  }
  ```

  Response: `ApiResponse<AuthResponse>`

  ```json
  {
    "code": 200,
    "message": "Login successful",
    "data": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
  ```

- **POST /api/auth/logout**  
  Request Header: `Authorization: Bearer <token>`  
  Response: `ApiResponse<String>`

- **GET /api/auth/me**  
  Request: Authentication required  
  Response: `ApiResponse<UserResponse>`

- **PUT /api/auth/profile**  
  Request Body: `UserRequest`

  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com",
    "fullName": "New Full Name",
    "bio": "Updated bio",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```

  Response: `ApiResponse<UserResponse>`

- **POST /api/auth/forgot-password**  
  Request Body: `ForgotPasswordRequest`

  ```json
  {
    "email": "user@example.com"
  }
  ```

  Response: `ApiResponse<String>`

- **POST /api/auth/reset-password**  
  Request Body: `ResetPasswordRequest`

  ```json
  {
    "token": "reset_token_here",
    "newPassword": "newpassword123"
  }
  ```

  Response: `ApiResponse<String>`

- **POST /api/auth/refresh-token**  
  Request Body: `RefreshTokenRequest`
  ```json
  {
    "refreshToken": "refresh_token_here"
  }
  ```
  Response: `ApiResponse<TokenResponse>`

### 2. **ChapterController** (`/api/novels/{novelId}/chapters`)

- **GET /api/novels/{novelId}/chapters**  
  Request: Path `novelId` (Long)  
  Response: `ApiResponse<List<ChapterResponse>>`

- **GET /api/novels/{novelId}/chapters/{chapterId}**  
  Request: Path `novelId`, `chapterId` (Long)  
  Response: `ApiResponse<ChapterResponse>`

- **POST /api/novels/{novelId}/chapters**  
  Request Body: `ChapterRequest`

  ```json
  {
    "title": "Chapter 1: The Beginning",
    "content": "Chapter content here...",
    "chapterNumber": 1
  }
  ```

  Response: `ApiResponse<ChapterResponse>`

- **PUT /api/novels/{novelId}/chapters/{chapterId}**  
  Request Body: `ChapterRequest`

  ```json
  {
    "title": "Updated Chapter Title",
    "content": "Updated chapter content...",
    "chapterNumber": 1
  }
  ```

  Response: `ApiResponse<ChapterResponse>`

- **DELETE /api/novels/{novelId}/chapters/{chapterId}**  
  Request: Path parameters only  
  Response: `ApiResponse<Void>`

- **POST /api/novels/{novelId}/chapters/{chapterId}/views**  
  Request: Path parameters only  
  Response: `ApiResponse<Void>`

### 3. **CommentController** (`/api`)

- **GET /api/posts/{postId}/comments**  
  Request: Path `postId` (Long)  
  Response: `ApiResponse<List<CommentResponse>>`

- **POST /api/posts/{postId}/comments**  
  Request Body: `CommentRequest`

  ```json
  {
    "content": "This is a comment",
    "parentId": null
  }
  ```

  Response: `ApiResponse<CommentResponse>`

- **GET /api/novels/{novelId}/comments**  
  Request: Path `novelId` (Long)  
  Response: `ApiResponse<List<CommentResponse>>`

- **POST /api/novels/{novelId}/comments**  
  Request Body: `CommentRequest`

  ```json
  {
    "content": "Great novel!",
    "parentId": null
  }
  ```

  Response: `ApiResponse<CommentResponse>`

- **PUT /api/comments/{commentId}**  
  Request Body: `CommentRequest`

  ```json
  {
    "content": "Updated comment content",
    "parentId": null
  }
  ```

  Response: `ApiResponse<CommentResponse>`

- **DELETE /api/comments/{commentId}**  
  Request: Path `commentId` (Long)  
  Response: `ApiResponse<Void>`

- **POST /api/comments/{commentId}/like**  
  Request: Path `commentId` (Long)  
  Response: `ApiResponse<Void>`

### 4. **FileUploadController** (`/api/uploads`)

- **POST /api/uploads/novels/cover-image**  
  Request: Multipart form data with `image` field  
  Response: `ResponseEntity<ApiResponse<String>>`

  ```json
  {
    "code": 200,
    "message": "Image uploaded successfully",
    "data": "https://cloudinary.com/image_url"
  }
  ```

- **DELETE /api/uploads/novels/cover-image**  
  Request: Query parameter `publicId`  
  Response: `ApiResponse<String>`

### 5. **NovelController** (`/api/novels`)

- **GET /api/novels**  
  Request: Query parameters `title`, `genreId`, `author`, `page`, `size`  
  Response: `ApiResponse<PagedResponse<NovelResponse>>`

- **GET /api/novels/{id}**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<NovelResponse>`

- **POST /api/novels** (Admin only)  
  Request Body: `NovelRequest`

  ```json
  {
    "title": "My New Novel",
    "description": "A great story about...",
    "authorId": 1,
    "genreIds": [1, 2, 3],
    "status": "ONGOING"
  }
  ```

  Response: `ApiResponse<NovelResponse>`

- **PUT /api/novels/{id}** (Admin only)  
  Request Body: `NovelRequest`  
  Response: `ApiResponse<NovelResponse>`

- **DELETE /api/novels/{id}** (Admin only)  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

- **POST /api/novels/{id}/like**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

- **POST /api/novels/{id}/favorite**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

- **GET /api/novels/genres**  
  Request: None  
  Response: `ApiResponse<Object>` (Genres list)

- **POST /api/novels/{id}/rating**  
  Request: Path `id` (Long), Query `rating` (int)  
  Response: `ApiResponse<Void>`

### 6. **PostController** (`/api/posts`)

- **GET /api/posts**  
  Request: Query parameters `title`, `categoryId`, `tagId`, `status`, `page`, `size`  
  Response: `ApiResponse<PagedResponse<PostResponse>>`

- **GET /api/posts/{id}**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<PostResponse>`

- **POST /api/posts** (Admin only)  
  Request Body: `PostRequest`

  ```json
  {
    "title": "My Blog Post",
    "content": "Post content here...",
    "authorId": 1,
    "status": "PUBLISHED",
    "categoryIds": [1, 2],
    "tagIds": [1, 2, 3]
  }
  ```

  Response: `ApiResponse<PostResponse>`

- **PUT /api/posts/{id}** (Admin only)  
  Request Body: `PostRequest`  
  Response: `ApiResponse<PostResponse>`

- **DELETE /api/posts/{id}** (Admin only)  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

- **POST /api/posts/{id}/views**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

### 7. **SearchController** (`/api/search`)

- **GET /api/search**  
  Request: Query parameters `q`, `page`, `size`  
  Response: `ApiResponse<SearchResultResponse>`

- **GET /api/search/posts**  
  Request: Query parameters `q`, `page`, `size`  
  Response: `ApiResponse<PagedResponse<SearchResultResponse.PostSearchResult>>`

- **GET /api/search/novels**  
  Request: Query parameters `q`, `page`, `size`  
  Response: `ApiResponse<PagedResponse<SearchResultResponse.NovelSearchResult>>`

- **GET /api/search/suggestions**  
  Request: Query parameter `q`  
  Response: `ApiResponse<SearchSuggestionResponse>`

### 8. **UserController** (`/api/users`)

- **GET /api/users**  
  Request: None  
  Response: `ApiResponse<List<UserResponse>>`

- **GET /api/users/{id}**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<UserResponse>`

- **PUT /api/users/{id}**  
  Request Body: `UserRequest`

  ```json
  {
    "username": "newusername",
    "email": "newemail@example.com",
    "fullName": "New Full Name",
    "bio": "Updated bio",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```

  Response: `ApiResponse<UserResponse>`

- **DELETE /api/users/{id}**  
  Request: Path `id` (Long)  
  Response: `ApiResponse<Void>`

- **PUT /api/users/{id}/status**  
  Request: Path `id` (Long), Query `status` (String)  
  Response: `ApiResponse<UserResponse>`

- **PUT /api/users/{id}/role**  
  Request: Path `id` (Long), Query `role` (String)  
  Response: `ApiResponse<UserResponse>`

### 9. **AnalyticsController** (`/api/analytics`) - Admin only

- **GET /api/analytics/dashboard**  
  Request: None  
  Response: `ApiResponse<AnalyticsDashboardResponse>`

- **GET /api/analytics/posts**  
  Request: None  
  Response: `ApiResponse<AnalyticsPostsResponse>`

- **GET /api/analytics/novels**  
  Request: None  
  Response: `ApiResponse<AnalyticsNovelsResponse>`

- **GET /api/analytics/users**  
  Request: None  
  Response: `ApiResponse<AnalyticsUsersResponse>`

- **GET /api/analytics/traffic**  
  Request: None  
  Response: `ApiResponse<AnalyticsTrafficResponse>`

## Ghi chú:

- Tất cả response đều được wrap trong `ApiResponse<T>`, bao gồm `code`, `message`, và `data`.
- Các endpoint có thể yêu cầu authentication hoặc role cụ thể (như ADMIN).
- Đối với file upload, sử dụng `MultipartFile` thay vì DTO.
- PagedResponse được sử dụng cho các danh sách phân trang.
- Các validation constraints được áp dụng cho request DTOs (như @NotBlank, @Size, @Email).
- Một số fields trong request DTOs là optional, có thể null hoặc không cần gửi.
