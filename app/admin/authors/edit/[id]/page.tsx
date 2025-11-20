"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Save, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { AuthorResponse } from "@/types/api";

export default function EditAuthorPage() {
  const [author, setAuthor] = useState<AuthorResponse | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const authorId = params?.id ? parseInt(params.id as string) : null;

  const fetchAuthor = async () => {
    if (!authorId) {
      setError("ID tác giả không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.getAuthorById(authorId);
      const authorData = response.data;

      setAuthor(authorData);
      setName(authorData.name || "");
      setBio(authorData.bio || "");
      setAvatarUrl(authorData.avatarUrl || "");
      setError("");
    } catch (err: any) {
      console.error("Error fetching author:", err);
      setError("Không thể tải thông tin tác giả. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthor();
  }, [authorId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Clear URL input when file is selected
      setAvatarUrl("");

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarUrl(e.target.value);
    // Clear file when URL is entered
    if (e.target.value.trim()) {
      setAvatarFile(null);
      setAvatarPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorId || !name.trim()) {
      setError("Vui lòng nhập tên tác giả.");
      return;
    }

    if (name.length < 2 || name.length > 255) {
      setError("Tên tác giả phải có độ dài từ 2-255 ký tự.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      let response;

      if (avatarFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("name", name.trim());
        if (bio.trim()) formData.append("bio", bio.trim());
        formData.append("avatarImage", avatarFile);

        response = await apiClient.updateAuthor(authorId, formData);
      } else {
        // Use regular object for URL-based avatar
        const authorData = {
          name: name.trim(),
          bio: bio.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
        };

        response = await apiClient.updateAuthor(authorId, authorData);
      }

      console.log("Author updated:", response.data);

      // Clean up object URL if it was created
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }

      // Redirect to authors list
      router.push("/admin/authors");
    } catch (err: any) {
      console.error("Error updating author:", err);
      setError(
        err.message || "Có lỗi xảy ra khi cập nhật tác giả. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error && !author) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link
            href="/admin/authors"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Quay lại danh sách tác giả
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/authors"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chỉnh Sửa Tác Giả
            </h1>
          </div>
          <button
            type="submit"
            form="author-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline-block mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form id="author-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Thông tin tác giả
              </h2>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên tác giả <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập tên tác giả..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Độ dài: 2-255 ký tự
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giới thiệu
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Nhập thông tin giới thiệu về tác giả..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mô tả ngắn gọn về tác giả (tùy chọn)
              </p>
            </div>

            {/* Avatar Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ảnh đại diện
              </label>

              {/* File Upload */}
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chọn file ảnh để upload (JPG, PNG, GIF)
                </p>
              </div>

              {/* OR separator */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Hoặc
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={handleUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Nhập link ảnh đại diện (tùy chọn)
                </p>
              </div>
            </div>

            {/* Avatar Preview */}
            {(avatarUrl || avatarPreview) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Xem trước ảnh đại diện
                </label>
                <div className="inline-block">
                  <img
                    src={avatarPreview || avatarUrl}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  {avatarFile && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      File sẽ được upload: {avatarFile.name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
