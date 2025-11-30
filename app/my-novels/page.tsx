"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Eye, Edit, Trash2, Plus, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse } from "@/types/api";

export default function MyNovelsPage() {
  const [novels, setNovels] = useState<NovelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyNovels();
    }
  }, [user]);

  const fetchMyNovels = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Fetching novels for creator:", user.id, user.username);

      const response = await apiClient.getNovelsByCreator(user.id);
      console.log("API Response:", response);

      if (response && response.data) {
        setNovels(response.data.content || []);
        console.log("Novels loaded:", response.data.content?.length || 0);
      } else {
        console.warn("Invalid API response structure:", response);
        setError("Phản hồi API không hợp lệ.");
      }
    } catch (err) {
      console.error("Failed to fetch novels:", err);
      setError("Không thể tải tiểu thuyết. Vui lòng thử lại sau.");
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
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải tiểu thuyết...
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
              Tiểu thuyết của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Quản lý tất cả tiểu thuyết bạn đã đăng
            </p>
          </div>
          <Link
            href="/novels/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo tiểu thuyết mới
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchMyNovels}
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
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn chưa có tiểu thuyết nào.
                </p>
                <Link
                  href="/novels/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo tiểu thuyết đầu tiên
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {novels.map((novel) => (
                  <article
                    key={novel.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer transform hover:rotate-1"
                  >
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
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/novels/${novel.id}`}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Xem
                        </Link>
                        <Link
                          href={`/novels/edit/${novel.id}`}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/30 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Link>
                        <Link
                          href={`/my-novels/${novel.id}/chapters`}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Chương
                        </Link>
                      </div>
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
