"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { GenreResponse, NovelStatus, AuthorResponse } from "@/types/api";
import { NovelStatus as NovelStatusEnum } from "@/types/api";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { AuthorCreateModal } from "@/components/ui/author-create-modal";

export default function NewNovelPage() {
  const [novelTitle, setNovelTitle] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState<AuthorResponse[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [synopsis, setSynopsis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [genres, setGenres] = useState<
    { id: number; name: string; description?: string }[]
  >([]);

  // Set default author from user profile
  useEffect(() => {
    if (user && user.fullName && selectedAuthors.length === 0) {
      // Create a default author object if needed, but since it's from user, we might need to handle differently
      // For now, we'll leave it empty and let user select
    }
  }, [user, selectedAuthors]);

  // Fetch genres on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      const fetchGenres = async () => {
        try {
          // Try getGenres first, fallback to getCategories
          let response = await apiClient.getGenres();
          if (!response?.data) {
            response = await apiClient.getCategories();
          }
          if (response && response.data) {
            setGenres(response.data);
          } else {
            console.error("Failed to fetch genres");
          }
        } catch (error) {
          console.error("Error fetching genres:", error);
        }
      };
      fetchGenres();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Đang kiểm tra đăng nhập...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (genreId: number, checked: boolean) => {
    if (checked) {
      setSelectedGenres((prev) => [...prev, genreId]);
    } else {
      setSelectedGenres((prev) => prev.filter((id) => id !== genreId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (
      !novelTitle.trim() ||
      selectedAuthors.length === 0 ||
      selectedGenres.length === 0
    ) {
      setError(
        "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, tác giả, ít nhất một thể loại)."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const novelData = {
        title: novelTitle.trim(),
        description: synopsis.trim(),
        authorIds: selectedAuthors.map((a) => a.id),
        genreIds: selectedGenres,
        status: status as any,
        coverImage: coverImage || undefined,
      };

      const response = await apiClient.createNovel(novelData);
      console.log("Novel created:", response.data);

      // Redirect to my novels
      router.push("/my-novels");
    } catch (error: any) {
      console.error("Error creating novel:", error);
      setError(
        error.message || "Có lỗi xảy ra khi tạo tiểu thuyết. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/my-novels"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tạo Tiểu Thuyết Mới
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setStatus("DRAFT");
                handleSubmit(new Event("submit") as any);
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu Nháp
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("ONGOING");
                handleSubmit(new Event("submit") as any);
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất Bản
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu Đề Tiểu Thuyết
            </label>
            <input
              type="text"
              value={novelTitle}
              onChange={(e) => setNovelTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề tiểu thuyết..."
              required
            />
          </div>
          {/* Author & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tác Giả (chọn ít nhất 1)
              </label>
              <MultiSelectCombobox
                value={selectedAuthors}
                onChange={setSelectedAuthors}
                placeholder="Chọn hoặc tạo tác giả..."
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thể Loại (chọn ít nhất 1)
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {genres.map((g) => (
                  <label key={g.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(g.id)}
                      onChange={(e) =>
                        handleGenreChange(g.id, e.target.checked)
                      }
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {g.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ảnh Bìa
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 dark:text-gray-400
        file:mr-4 file:py-2 file:px-4
        file:rounded-lg file:border-0
        file:text-sm file:font-medium
        file:bg-blue-50 file:text-blue-700
        dark:file:bg-blue-900 dark:file:text-blue-200
        hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-24 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
          {/* Synopsis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tóm Tắt
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tóm tắt tiểu thuyết..."
            />
          </div>
        </form>
      </div>
    </div>
  );
}
