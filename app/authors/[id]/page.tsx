"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Eye,
  BookOpen,
  Users,
  Star,
  ArrowLeft,
  Heart,
  Loader2,
  UserCheck,
  Crown,
  Award,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse, AuthorResponse } from "@/types/api";

interface ExtendedAuthorResponse extends AuthorResponse {
  followerCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AuthorDetailPage() {
  const params = useParams();
  const authorId = parseInt(params.id as string);
  const { user } = useAuth();

  const [author, setAuthor] = useState<ExtendedAuthorResponse | null>(null);
  const [novels, setNovels] = useState<NovelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (authorId) {
      fetchAuthorData();
    }
  }, [authorId, user]);

  const fetchAuthorData = async () => {
    if (!authorId) return;

    try {
      setIsLoading(true);

      // Fetch author details
      const authorResponse = await apiClient.getAuthorById(authorId);
      if (authorResponse.data) {
        setAuthor(authorResponse.data);
      }

      // Fetch author's novels using the specific endpoint
      const novelsResponse = await apiClient.getNovelsByAuthor(authorId, {
        page: 0,
        size: 10,
      });
      setNovels(novelsResponse.data.content || []);

      // Check if user is following this author
      if (user) {
        try {
          const isFollowingResponse = await apiClient.isFollowingAuthor(
            authorId
          );
          setIsFollowing(isFollowingResponse);
        } catch (error) {
          console.error("Failed to check follow status:", error);
        }
      }
    } catch (err) {
      console.error("Failed to fetch author data:", err);
      setError("Không thể tải thông tin tác giả. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!user || !author) return;

    try {
      if (isFollowing) {
        await apiClient.unfollowAuthor(author.id);
        setIsFollowing(false);
        // Update follower count if available
        if (author.followerCount !== undefined) {
          setAuthor((prev) =>
            prev
              ? { ...prev, followerCount: (prev.followerCount || 0) - 1 }
              : null
          );
        }
      } else {
        await apiClient.followAuthor(author.id);
        setIsFollowing(true);
        // Update follower count if available
        if (author.followerCount !== undefined) {
          setAuthor((prev) =>
            prev
              ? { ...prev, followerCount: (prev.followerCount || 0) + 1 }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Nháp";
      case "ONGOING":
        return "Đang tiến hành";
      case "COMPLETED":
        return "Hoàn thành";
      case "HIATUS":
        return "Tạm ngưng";
      case "DROPPED":
        return "Bỏ dở";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      case "ONGOING":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "COMPLETED":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "HIATUS":
        return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200";
      case "DROPPED":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải thông tin tác giả...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || "Không tìm thấy tác giả"}
            </p>
            <Link
              href="/followed-authors"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorStats = {
    totalNovels: novels.length,
    completedNovels: novels.filter((n) => n.status === "COMPLETED").length,
    totalViews: novels.reduce((sum, n) => sum + (n.viewCount || 0), 0),
    totalLikes: novels.reduce((sum, n) => sum + (n.likeCount || 0), 0),
    avgRating:
      novels.length > 0
        ? novels.reduce((sum, n) => sum + (n.avgRating || 0), 0) / novels.length
        : 0,
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/followed-authors"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách tác giả
          </Link>
        </div>

        {/* Author Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
              {author.avatarUrl ? (
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                    {(author.name || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {author.name}
                </h1>
                {user && (
                  <button
                    onClick={handleFollowToggle}
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        Đã follow
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                {author.followerCount !== undefined && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{author.followerCount} người theo dõi</span>
                  </div>
                )}
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{authorStats.totalNovels} tiểu thuyết</span>
                </div>
                {author.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Tham gia {formatDate(author.createdAt)}</span>
                  </div>
                )}
              </div>

              {author.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {authorStats.totalNovels}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tiểu thuyết
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {authorStats.completedNovels}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hoàn thành
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {authorStats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lượt xem
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {authorStats.avgRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Đánh giá TB
            </div>
          </div>
        </div>

        {/* Novels Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tiểu thuyết của {author.name}
          </h2>

          {novels.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Tác giả chưa có tiểu thuyết nào.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {novels.map((novel) => (
                <article
                  key={novel.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                    <img
                      src={novel.coverImage || "/placeholder-novel.svg"}
                      alt={novel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          novel.status
                        )}`}
                      >
                        {getStatusText(novel.status)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {novel.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
                      {novel.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Cập nhật: {formatDate(novel.updatedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{novel.viewCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>{novel.totalChapters || 0} chương</span>
                      <span>★ {novel.avgRating?.toFixed(1) || "0.0"}</span>
                    </div>

                    <Link
                      href={`/novels/${novel.id}`}
                      className="w-full flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors text-sm"
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      Đọc ngay
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
