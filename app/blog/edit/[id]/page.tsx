"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import {
  ChevronLeft,
  Save,
  Send,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { PostResponse, PostRequest } from "@/types/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [id, setId] = useState<string>("");
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    initializeParams();
  }, [params]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.getCategories();
        if (response && response.data) {
          const categoryObjects = response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
          }));
          setCategories(categoryObjects);
        } else {
          throw new Error("Categories API not available");
        }
      } catch (err) {
        setCategories([
          { id: 1, name: "Công nghệ", slug: "cong-nghe" },
          { id: 2, name: "Đời sống", slug: "doi-song" },
          { id: 3, name: "Du lịch", slug: "du-lich" },
          { id: 4, name: "Sách", slug: "sach" },
          { id: 5, name: "Phim ảnh", slug: "phim-anh" },
          { id: 6, name: "Ẩm thực", slug: "am-thuc" },
          { id: 7, name: "Sức khỏe", slug: "suc-khoe" },
        ]);
      }
    };

    if (isAuthenticated && user) {
      fetchCategories();
    }
  }, [isAuthenticated, user]);

  // Fetch post data
  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      // Don't fetch if id is empty
      if (!id) {
        return;
      }

      try {
        setIsLoading(true);
        const postResponse = await apiClient.getPostById(parseInt(id));
        const postData = postResponse.data;

        // Check if user owns this post
        if (postData.authorId !== user.id) {
          setUnauthorized(true);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
        setCategoryIds(postData.categories.map((cat) => cat.id));
        setTagIds(postData.tags.map((tag) => tag.id));
        setStatus(postData.status);
        setImagePreview(postData.coverImage || "");
      } catch (err) {
        console.error("Failed to fetch post data:", err);
        setError("Không thể tải dữ liệu bài viết.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user, isAuthenticated, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get form data properly
      const formData = new FormData();

      // Add title
      formData.append("title", title.trim());

      // Get editor content (this becomes "content" in the API)
      const editorContent = editorRef.current?.getContent() || "";
      formData.append("content", editorContent);

      // Add category IDs (categories become "categoryIds" in the API)
      categoryIds.forEach((id: number) => {
        formData.append("categoryIds", id.toString());
      });

      // Add tag IDs (separate from categoryIds)
      tagIds.forEach((id: number) => {
        formData.append("tagIds", id.toString());
      });

      // Add author ID and status
      const authorId = user?.id || 4; // Default to 4 if user.id is undefined
      formData.append("authorId", authorId.toString());
      formData.append("status", status);

      // Add cover image if exists
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      console.log("Form Data being sent:");
      console.log("Title:", title);
      console.log("Content length:", editorContent.length);
      console.log("Category IDs:", categoryIds);
      console.log("Tag IDs:", tagIds);
      console.log("User object:", user);
      console.log("User ID:", user.id);
      console.log("User ID type:", typeof user.id);
      console.log("Status:", status);
      console.log("Has cover image:", !!coverImage);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await apiClient.updatePostFromFormData(
        post!.id,
        formData
      );

      router.push("/my-posts");
    } catch (err: any) {
      setError(
        err.message || "Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setStatus("DRAFT");
  };

  const handlePublish = () => {
    setStatus("PUBLISHED");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu bài viết...
          </span>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">
            Bạn không có quyền chỉnh sửa bài viết này.
          </p>
          <Link
            href="/my-posts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại bài viết của tôi
          </Link>
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
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // Re-initialize params and fetch data
              const initializeAndFetch = async () => {
                const resolvedParams = await params;
                setId(resolvedParams.id);
              };
              initializeAndFetch();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Không tìm thấy bài viết.
          </p>
          <Link
            href="/my-posts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại bài viết của tôi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/my-posts"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chỉnh sửa bài viết
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setStatus("PUBLISHED")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất bản
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
            <p className="font-medium">Lỗi:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu Đề Bài Viết
            </label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>

          {/* Cover Image */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ảnh Bìa (Tùy chọn)
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="coverImage"
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
                    className="h-32 w-auto object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Categories and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh Mục (Tùy chọn)
              </label>
              <select
                multiple
                value={categoryIds.map(String)}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value)
                  );
                  setCategoryIds(values);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Giữ Ctrl để chọn nhiều danh mục
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Tùy chọn)
              </label>
              <select
                multiple
                value={tagIds.map(String)}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value)
                  );
                  setTagIds(values);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="1">AI</option>
                <option value="2">Blockchain</option>
                <option value="3">Metaverse</option>
                <option value="4">Công nghệ</option>
                <option value="5">Cuộc sống</option>
                <option value="6">Kinh nghiệm</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Giữ Ctrl để chọn nhiều tag
              </p>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội Dung Bài Viết
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={content}
              init={{
                height: 600,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "preview",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Xuất Bản
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
