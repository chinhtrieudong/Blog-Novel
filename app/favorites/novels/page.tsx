"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Calendar, Eye, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse } from "@/types/api";

export default function FavoriteNovelsPage() {
  const [novels, setNovels] = useState<NovelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavoriteNovels();
    }
  }, [user]);

  const fetchFavoriteNovels = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Fetching favorite novels for user:", user.id);

      const response = await apiClient.getFavoriteNovelsPaginated();
      console.log("API Response:", response);

      if (response && response.data) {
        setNovels(response.data.content || []);
        console.log(
          "Favorite novels loaded:",
          response.data.content?.length || 0
        );
      } else {
        console.warn("Invalid API response structure:", response);
        setError("Phản hồi API không hợp lệ.");
      }
    } catch (err) {
      console.error("Failed to fetch favorite novels:", err);
      setError("Không thể tải tiểu thuyết yêu thích. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
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
              Đang tải tiểu thuyết yêu thích...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tiểu thuyết yêu thích
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Danh sách các tiểu thuyết bạn đã yêu thích
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchFavoriteNovels}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Novels Grid */}
        {!error && (
          <>
            {novels.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn chưa có tiểu thuyết yêu thích nào.
                </p>
                <Link
                  href="/novels"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Khám phá tiểu thuyết
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {novels.map((novel) => (
                  <article
                    key={novel.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer transform hover:rotate-1 relative"
                  >
                    {/* Favorite Indicator */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-red-500 rounded-full p-2">
                        <Heart className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>

                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={novel.coverImage || "/default-img.png"}
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

                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {novel.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
                        {novel.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Cập nhật: {formatDate(novel.updatedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{novel.viewCount || 0} lượt xem</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span>{novel.totalChapters || 0} chương</span>
                        <span>★ {novel.avgRating?.toFixed(1) || "0.0"}</span>
                        <span>{novel.likeCount || 0} yêu thích</span>
                      </div>

                      <Link
                        href={`/novels/${novel.id}`}
                        className="w-full flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        Đọc ngay
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
