"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse, PagedResponse } from "@/types/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DeleteConfirmationModal } from "@/components/admin/modals/DeleteConfirmationModal";

export default function AdminNovelsPage() {
  const [novels, setNovels] = useState<NovelResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [novelToDelete, setNovelToDelete] = useState<NovelResponse | null>(
    null
  );
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNovels();
    }
  }, [isAuthenticated, user, currentPage, searchTerm, statusFilter]);

  const fetchNovels = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        size: 10,
      };

      if (searchTerm) {
        params.title = searchTerm;
      }

      const response = await apiClient.getNovels(params);
      const data = response.data as PagedResponse<NovelResponse>;

      setNovels(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch novels:", err);
      setError("Không thể tải danh sách tiểu thuyết.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (novel: NovelResponse) => {
    setNovelToDelete(novel);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!novelToDelete) return;

    try {
      setIsDeleting(novelToDelete.id);
      await apiClient.deleteNovel(novelToDelete.id);
      await fetchNovels(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to delete novel:", err);
      alert("Không thể xóa tiểu thuyết. Vui lòng thử lại.");
    } finally {
      setIsDeleting(null);
      setDeleteModalOpen(false);
      setNovelToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setNovelToDelete(null);
  };

  const handleStatusChange = async (novelId: number, newStatus: string) => {
    try {
      await apiClient.updateNovelStatus(novelId, newStatus);
      await fetchNovels(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to update novel status:", err);
      alert("Không thể cập nhật trạng thái tiểu thuyết. Vui lòng thử lại.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Đang tiếp tục
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Hoàn thành
          </span>
        );
      case "DROPPED":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Đã dừng
          </span>
        );
      case "HIATUS":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Tạm nghỉ
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Đang tải danh sách tiểu thuyết...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchNovels}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý tiểu thuyết
          </h1>
          <Link
            href="/novels/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm tiểu thuyết mới
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tiểu thuyết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ONGOING">Đang tiếp tục</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="DROPPED">Đã dừng</option>
                <option value="HIATUS">Tạm nghỉ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Novels Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tiểu thuyết
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {novels.map((novel) => (
                  <tr
                    key={novel.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {novel.coverImage && (
                          <img
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            src={novel.coverImage}
                            alt={novel.title}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {novel.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {novel.genres.map((genre) => genre.name).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {novel.author?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(novel.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(novel.createdAt), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {novel.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/novels/${novel.id}`}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Xem tiểu thuyết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/novels/${novel.id}/chapters`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Quản lý chương"
                        >
                          📖
                        </Link>
                        <button
                          onClick={() =>
                            handleStatusChange(novel.id, "ONGOING")
                          }
                          disabled={novel.status === "ONGOING"}
                          className={`${
                            novel.status === "ONGOING"
                              ? "text-green-600 dark:text-green-400"
                              : "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          } disabled:opacity-50`}
                          title="Đặt đang tiếp tục"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(novel.id, "COMPLETED")
                          }
                          disabled={novel.status === "COMPLETED"}
                          className={`${
                            novel.status === "COMPLETED"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          } disabled:opacity-50`}
                          title="Đặt hoàn thành"
                        >
                          🎯
                        </button>
                        <Link
                          href={`/admin/novels/edit/${novel.id}`}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(novel)}
                          disabled={isDeleting === novel.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          title="Xóa tiểu thuyết"
                        >
                          {isDeleting === novel.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {novels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Không có tiểu thuyết nào.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Trang {currentPage} / {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemType="novel"
          itemTitle={novelToDelete?.title || ""}
        />
      </div>
    </div>
  );
}
