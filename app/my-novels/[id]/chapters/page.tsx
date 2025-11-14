"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  BookOpen,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse, ChapterResponse } from "@/types/api";

export default function MyChaptersManagementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [novel, setNovel] = useState<NovelResponse | null>(null);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const { id } = use(params);

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      try {
        // Fetch novel data
        const novelResponse = await apiClient.getNovelById(parseInt(id));
        const novelData = novelResponse.data;

        // Check if user owns this novel
        console.log("Debug - novelData:", novelData);
        console.log("Debug - novelData.author:", novelData.author);
        console.log("Debug - novelData.createdBy:", novelData.createdBy);
        console.log("Debug - user:", user);
        console.log("Debug - user.id:", user.id, typeof user.id);

        // Check ownership using createdBy field
        const ownerId =
          novelData.createdBy || (novelData.author && novelData.author.id);
        console.log("Debug - ownerId:", ownerId?.toString(), typeof ownerId);

        if (
          !ownerId ||
          parseInt(ownerId.toString()) !== parseInt(user.id.toString())
        ) {
          setUnauthorized(true);
          return;
        }

        setNovel(novelData);

        // Fetch chapters
        const chaptersResponse = await apiClient.getChapters(parseInt(id));
        setChapters(chaptersResponse.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user, isAuthenticated, router]);

  const handleDeleteChapter = async (
    chapterId: number,
    chapterTitle: string
  ) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa chương "${chapterTitle}"?`)) {
      return;
    }

    try {
      await apiClient.deleteChapter(parseInt(id), chapterId);

      // Refresh chapters list
      const chaptersResponse = await apiClient.getChapters(parseInt(id));
      setChapters(chaptersResponse.data || []);
    } catch (err) {
      console.error("Failed to delete chapter:", err);
      alert("Không thể xóa chương. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không có quyền truy cập
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn không có quyền chỉnh sửa tiểu thuyết này.
          </p>
          <Link
            href="/my-novels"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại tiểu thuyết của tôi
          </Link>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy tiểu thuyết
          </h1>
          <Link
            href="/my-novels"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại tiểu thuyết của tôi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/my-novels"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý chương
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tiểu thuyết: {novel.title}
              </p>
            </div>
          </div>
          <Link
            href={`/my-novels/${id}/chapters/new`}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm chương mới
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        {/* Chapters List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Danh sách chương ({chapters.length})
            </h2>
          </div>

          {chapters.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có chương nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bắt đầu viết chương đầu tiên cho tiểu thuyết của bạn.
              </p>
              <Link
                href={`/my-novels/${id}/chapters/new`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Viết chương đầu tiên
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Chương
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Số từ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Lượt xem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {chapters.map((chapter) => (
                    <tr key={chapter.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                              {chapter.chapterNumber}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {chapter.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {chapter.wordCount?.toLocaleString() ?? "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {chapter.viewCount?.toLocaleString() ?? "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(chapter.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/novels/${id}/chapter/${chapter.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="Xem chương"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteChapter(chapter.id, chapter.title)
                            }
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="Xóa chương"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {chapters.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Thao tác nhanh
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/my-novels/${id}/chapters/new`}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm chương mới
              </Link>
              <Link
                href={`/novels/${id}`}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem tiểu thuyết
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
