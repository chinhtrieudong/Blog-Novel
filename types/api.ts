// API Request DTOs
export interface AuthRequest {
  email?: string;
  username: string;
  password: string;
}

export interface ChapterRequest {
  title: string;
  content: string;
  chapterNumber?: number;
}

export interface CommentRequest {
  content: string;
  parentId?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface NovelRequest {
  title: string;
  description: string;
  authorIds?: number[];
  genreIds?: number[];
  status?: NovelStatus;
  coverImage?: File;
}

export interface AuthorRequest {
  name: string;
  bio?: string;
  avatarImage?: File;
}

export interface PostRequest {
  title: string;
  content: string;
  coverImage?: File;
  authorId?: number;
  status?: string;
  categoryIds?: number[];
  tagIds?: number[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UserRequest {
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
}

// API Response DTOs
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  page: number;
  first: boolean;
  last: boolean;
}

// Entity Response DTOs
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovelResponse {
  id: number;
  title: string;
  description: string;
  author: AuthorResponse;
  genres: GenreResponse[];
  status: NovelStatus;
  coverImage?: string;
  totalChapters: number;
  viewCount: number;
  likeCount: number;
  avgRating: number;
  createdAt: string;
  updatedAt: string;
  lastChapterUpdate?: string;
  createdBy?: number; // ID of the user who created this novel
}

export interface AuthorResponse {
  id: number;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

export interface ChapterResponse {
  id: number;
  title: string;
  content: string;
  chapterNumber: number;
  novelId: number;
  viewCount: number;
  likes: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  coverImage?: string | null;
  status: string;
  authorId: number;
  authorName: string;
  categories: CategoryResponse[];
  tags: TagResponse[];
  viewCount: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  user: UserResponse;
  parentId?: number;
  replies?: CommentResponse[];
  likes: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenreResponse {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface TagResponse {
  id: number;
  name: string;
  slug: string;
}

// Search DTOs
export interface SearchResultResponse {
  posts: PostSearchResult[];
  novels: NovelSearchResult[];
  totalResults: number;
}

export interface PostSearchResult {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  author: string;
  publishedAt: string;
}

export interface NovelSearchResult {
  id: number;
  title: string;
  description: string;
  author: string;
  coverImage?: string;
  totalChapters: number;
  avgRating: number;
  status: NovelStatus;
}

export interface SearchSuggestionResponse {
  suggestions: string[];
}

// Analytics DTOs
export interface AnalyticsDashboardResponse {
  totalUsers: number;
  totalPosts: number;
  totalNovels: number;
  viewCount: number;
  recentActivity: ActivityItem[];
}

export interface AnalyticsPostsResponse {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  mostViewedPosts: PostResponse[];
  postsGrowth: GrowthData[];
}

export interface AnalyticsNovelsResponse {
  totalNovels: number;
  ongoingNovels: number;
  completedNovels: number;
  mostPopularNovels: NovelResponse[];
  novelsGrowth: GrowthData[];
}

export interface AnalyticsUsersResponse {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: GrowthData[];
}

export interface AnalyticsTrafficResponse {
  viewCount: number;
  uniqueVisitors: number;
  pageViews: number;
  trafficGrowth: GrowthData[];
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  user?: UserResponse;
}

export interface GrowthData {
  date: string;
  value: number;
}

// Enums
export enum NovelStatus {
  DRAFT = "DRAFT",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  HIATUS = "HIATUS",
  DROPPED = "DROPPED",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
}

// API Error Response
export interface ApiError {
  code: number;
  message: string;
  details?: string;
  timestamp: string;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface NovelQueryParams extends PaginationParams {
  title?: string;
  genreId?: number;
  author?: string;
}

export interface PostQueryParams extends PaginationParams {
  title?: string;
  categoryId?: number;
  tagId?: number;
  status?: string;
}

export interface SearchParams extends PaginationParams {
  q: string;
}
