"use client";

import { useState } from "react";
import { ChevronLeft, Save, User, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

export default function NewAuthorPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle file selection for avatar upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file hình ảnh.");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB.");
        return;
      }

      setAvatarFile(file);
      setAvatarUrl(""); // Clear URL when file is selected

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded file
  const removeFile = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
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
      // Prepare FormData for multipart upload
      const formData = new FormData();
      formData.append("name", name.trim());
      if (bio.trim()) {
        formData.append("bio", bio.trim());
      }

      // Handle avatar upload
      if (avatarFile) {
        formData.append("avatarImage", avatarFile);
      } else if (avatarUrl.trim()) {
        formData.append("avatarUrl", avatarUrl.trim());
      }

      // Use fetch directly for multipart upload
      const token = localStorage.getItem("token");
      const response = await fetch("/api/authors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Lỗi không xác định" }));
        throw new Error(errorData.message || `Lỗi HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log("Author created:", result);

      // Redirect to authors list
      router.push("/admin");
    } catch (err: any) {
      console.error("Error creating author:", err);
      setError(
        err.message || "Có lỗi xảy ra khi tạo tác giả. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Thêm Tác Giả Mới
            </h1>
          </div>
          <button
            type="submit"
            form="author-form"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline-block mr-2" />
            {isSubmitting ? "Đang lưu..." : "Lưu"}
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

            {/* Avatar Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tải lên ảnh đại diện
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="flex items-center justify-center w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <Upload className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {avatarFile ? avatarFile.name : "Chọn ảnh đại diện"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chọn file hình ảnh (JPG, PNG, GIF). Kích thước tối đa: 5MB
                </p>
              </div>
            </div>

            {/* Avatar URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL ảnh đại diện
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                disabled={!!avatarFile}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={
                  avatarFile
                    ? "Đã chọn file upload"
                    : "https://example.com/avatar.jpg"
                }
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Link ảnh đại diện của tác giả (tùy chọn). Không thể nhập khi đã
                chọn file upload.
              </p>
            </div>

            {/* Avatar Preview */}
            {(avatarPreview || avatarUrl) && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xem trước ảnh đại diện
                  </label>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="inline-block">
                  <img
                    src={avatarPreview || avatarUrl}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                {avatarFile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    File: {avatarFile.name} (
                    {(avatarFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
