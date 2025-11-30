"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { PostResponse } from "@/types/api";
import { DeleteConfirmationModal } from "@/components/admin/modals/DeleteConfirmationModal";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Fetching posts for user:", user.id, user.username);

      const response = await apiClient.getPostsByUser(user.id);
      console.log("API Response:", response);

      if (response && response.data) {
        setPosts(response.data.content || []);
        console.log("Posts loaded:", response.data.content?.length || 0);
      } else {
        console.warn("Invalid API response structure:", response);
        setError("Phản hồi API không hợp lệ.");
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
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

  const handleDeleteClick = (post: PostResponse) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    try {
      setDeletingId(postToDelete.id);
      await apiClient.deletePost(postToDelete.id);
      // Refresh danh sách bài viết sau khi xóa
      await fetchMyPosts();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Không thể xóa bài viết. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải bài viết...
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
              Bài viết của tôi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Quản lý tất cả bài viết bạn đã đăng
            </p>
          </div>
          <Link
            href="/blog/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Viết bài mới
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchMyPosts}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!error && (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn chưa có bài viết nào.
                </p>
                <Link
                  href="/blog/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Viết bài viết đầu tiên
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={post.coverImage || "/default-img.png"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            post.status === "PUBLISHED"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          }`}
                        >
                          {post.status === "PUBLISHED" ? "Đã xuất bản" : "Nháp"}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h2>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {post.status === "PUBLISHED"
                              ? formatDate(post.updatedAt || post.createdAt)
                              : "Chưa xuất bản"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{post.viewCount || 0} lượt xem</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/blog/edit/${post.id}`}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(post)}
                          disabled={deletingId === post.id}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === post.id ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          {deletingId === post.id ? "Đang xóa..." : "Xóa"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          itemType="post"
          itemTitle={postToDelete?.title || ""}
        />
      </div>
    </div>
  );
}
