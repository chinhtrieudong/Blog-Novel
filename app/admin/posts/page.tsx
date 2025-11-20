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
import { PostResponse, PagedResponse } from "@/types/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchPosts();
    }
  }, [isAuthenticated, user, currentPage, searchTerm, statusFilter]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        size: 10,
      };

      if (searchTerm) {
        params.title = searchTerm;
      }

      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }

      const response = await apiClient.getPosts(params);
      const data = response.data as PagedResponse<PostResponse>;

      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      setIsDeleting(postId);
      await apiClient.deletePost(postId);
      await fetchPosts(); // Refresh danh sách
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Không thể xóa bài viết. Vui lòng thử lại.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      // For now, we'll use a direct API call to update post status
      // In a real app, you might want to create a dedicated API method for this
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || ""
        }/posts/${postId}/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchPosts(); // Refresh danh sách
      } else {
        throw new Error("Không thể cập nhật trạng thái bài viết.");
      }
    } catch (err) {
      console.error("Failed to update post status:", err);
      alert("Không thể cập nhật trạng thái bài viết. Vui lòng thử lại.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Đã xuất bản
          </span>
        );
      case "PENDING_REVIEW":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Chờ duyệt
          </span>
        );
      case "DRAFT":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Nháp
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Đã lưu trữ
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
            Đang tải danh sách bài viết...
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
            onClick={fetchPosts}
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
            Quản lý bài viết
          </h1>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm bài viết mới
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
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING_REVIEW">Chờ duyệt</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="DRAFT">Nháp</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bài viết
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
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.coverImage && (
                          <img
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                            src={post.coverImage}
                            alt={post.title}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {post.categories.map((cat) => cat.name).join(", ")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {post.authorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.status === "PUBLISHED"
                        ? format(new Date(post.updatedAt), "dd/MM/yyyy", {
                            locale: vi,
                          })
                        : "Chưa xuất bản"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {post.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem bài viết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleStatusChange(post.id, "PUBLISHED")
                          }
                          disabled={post.status === "PUBLISHED"}
                          className={`${
                            post.status === "PUBLISHED"
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          } disabled:opacity-50`}
                          title="Duyệt bài viết"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(post.id, "ARCHIVED")
                          }
                          disabled={post.status === "ARCHIVED"}
                          className={`${
                            post.status === "ARCHIVED"
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          } disabled:opacity-50`}
                          title="Lưu trữ bài viết"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={isDeleting === post.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                          title="Xóa bài viết"
                        >
                          {isDeleting === post.id ? (
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

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Không có bài viết nào.
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
      </div>
    </div>
  );
}
