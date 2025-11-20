"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Users } from "lucide-react";
import apiClient from "@/lib/api-client";
import { AuthorResponse } from "@/types/api";
import { DeleteConfirmationModal } from "@/components/admin/modals";

export default function AuthorsAdminPage() {
  const [authors, setAuthors] = useState<AuthorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAuthors();
      setAuthors(response.data || []);
      setError("");
    } catch (err: any) {
      console.error("Error fetching authors:", err);
      setError("Không thể tải danh sách tác giả. Vui lòng thử lại.");
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDeleteClick = (author: AuthorResponse) => {
    setAuthorToDelete({ id: author.id, name: author.name });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!authorToDelete) return;

    try {
      await apiClient.deleteAuthor(authorToDelete.id);
      setAuthors((prev) => prev.filter((a) => a.id !== authorToDelete.id));
      setIsDeleteModalOpen(false);
      setAuthorToDelete(null);
    } catch (err: any) {
      console.error("Error deleting author:", err);
      alert("Không thể xóa tác giả. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Quản lý Tác giả
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Quản lý danh sách các tác giả trong hệ thống
            </p>
          </div>
          <Link
            href="/admin/authors/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm tác giả mới
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Card */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tổng số tác giả
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {authors.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authors Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tên tác giả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Giới thiệu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avatar
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
                {authors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có tác giả nào trong hệ thống</p>
                        <p className="text-sm mt-1">
                          Bắt đầu bằng cách thêm tác giả đầu tiên
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  authors.map((author) => (
                    <tr key={author.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {author.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {author.bio || "Chưa có giới thiệu"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {author.avatarUrl ? (
                          <img
                            src={author.avatarUrl}
                            alt={author.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {(author.name || "A").charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {/* You might want to format the createdAt date */}
                        {new Date().toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/authors/edit/${author.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(author)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemType="tác giả"
          itemTitle={authorToDelete?.name || ""}
        />
      </div>
    </div>
  );
}
