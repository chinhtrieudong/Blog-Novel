"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import {
  GenreResponse,
  NovelStatus,
  AuthorResponse,
  NovelResponse,
} from "@/types/api";
import { NovelStatus as NovelStatusEnum } from "@/types/api";
import { AuthorCreateModal } from "@/components/ui/author-create-modal";
import { GenreMultiSelect } from "@/components/ui/genre-multi-select";
import { SingleAuthorSelect } from "@/components/ui/single-author-select";

export default function EditNovelPage() {
  const params = useParams();
  const novelId = parseInt(params.id as string);
  const router = useRouter();

  const [novelTitle, setNovelTitle] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(
    null
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [synopsis, setSynopsis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [genres, setGenres] = useState<
    { id: number; name: string; description?: string }[]
  >([]);

  // Fetch novel data on component mount
  useEffect(() => {
    if (novelId && isAuthenticated) {
      fetchNovelData();
    }
  }, [novelId, isAuthenticated]);

  // Fetch genres on component mount
  useEffect(() => {
    if (isAuthenticated) {
      const fetchGenres = async () => {
        try {
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

  const fetchNovelData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getNovelById(novelId);
      const novel = response.data;

      if (novel) {
        setNovelTitle(novel.title || "");
        setSynopsis(novel.description || "");
        setStatus(novel.status || "DRAFT");
        setSelectedAuthor(novel.author);
        setSelectedGenres(novel.genres?.map((g: any) => g.id) || []);
        setImagePreview(novel.coverImage || "");
      }
    } catch (error) {
      console.error("Failed to fetch novel:", error);
      setError("Không thể tải thông tin tiểu thuyết.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Đang tải thông tin tiểu thuyết...
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

  const handleSubmit = async (e: React.FormEvent, submitStatus?: string) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!novelTitle.trim() || !selectedAuthor || selectedGenres.length === 0) {
      setError(
        "Vui lòng điền đầy đủ thông tin bắt buộc (tiêu đề, tác giả, ít nhất một thể loại)."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      // Create FormData for novel update
      const formData = new FormData();
      formData.append("title", novelTitle.trim());
      formData.append("description", synopsis.trim());

      // Append author ID as separate field with same name
      if (selectedAuthor) {
        formData.append("authorIds", selectedAuthor.id.toString());
      }

      // Append each genre ID as separate field with same name
      selectedGenres.forEach((genreId) => {
        formData.append("genreIds", genreId.toString());
      });

      formData.append("status", submitStatus || status);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      console.log("Submitting FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.updateNovelFromFormData(
        novelId,
        formData
      );
      console.log("Novel updated:", response);

      // Check for successful response with proper data structure
      if (response && response.code === 200) {
        console.log("Novel updated successfully:", response.data);

        // Show success toast
        toast({
          title: "Thành công",
          description: "Tiểu thuyết đã được cập nhật thành công!",
        });

        // Delay redirect to allow toast to show
        setTimeout(() => {
          router.push("/my-novels");
        }, 1500);
      } else {
        console.error("Update failed - invalid response:", response);
        setError("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("Error updating novel:", error);
      setError(
        error.message ||
          "Có lỗi xảy ra khi cập nhật tiểu thuyết. Vui lòng thử lại."
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
              Chỉnh Sửa Tiểu Thuyết
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "DRAFT")}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu Nháp
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "ONGOING")}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Cập Nhật
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
              <SingleAuthorSelect
                value={selectedAuthor}
                onChange={setSelectedAuthor}
                placeholder="Chọn hoặc tạo tác giả..."
              />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thể Loại (chọn ít nhất 1)
              </label>
              <GenreMultiSelect
                value={selectedGenres}
                onChange={setSelectedGenres}
                genres={genres}
                placeholder="Chọn thể loại..."
              />
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
