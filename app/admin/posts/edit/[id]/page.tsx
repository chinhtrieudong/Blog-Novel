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

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Mock categories for now - in real app this would come from API
  const categories = [
    { id: 1, name: "Công nghệ" },
    { id: 2, name: "Đời sống" },
    { id: 3, name: "Sách" },
    { id: 4, name: "Ẩm thực" },
    { id: 5, name: "Du lịch" },
    { id: 6, name: "Phim ảnh" },
  ];

  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      try {
        const postResponse = await apiClient.getPostById(parseInt(id));
        const postData = postResponse.data;

        // Check if user owns this post or is admin
        if (postData.author.id !== user.id && user.role !== "ADMIN") {
          setUnauthorized(true);
          return;
        }

        setPost(postData);
        setTitle(postData.title);
        setSelectedCategories(postData.categories.map((cat) => cat.id));
        setExcerpt(postData.excerpt || "");
        setStatus(postData.status);
        setImagePreview(postData.coverImageUrl || "");
      } catch (err) {
        console.error("Failed to fetch post data:", err);
        setError("Không thể tải dữ liệu bài viết.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user, isAuthenticated, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setIsSaving(true);
    setError(null);

    try {
      const content = editorRef.current?.getContent();

      const postData: PostRequest = {
        title,
        content,
        status: status as "DRAFT" | "PUBLISHED",
        categoryIds: selectedCategories,
      };

      if (coverImage) {
        postData.coverImage = coverImage;
      }

      await apiClient.updatePost(post.id, postData);
      router.push("/admin/posts");
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Không thể cập nhật bài viết. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
            href="/admin/posts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
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
              href="/admin"
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
              onClick={() => setStatus("draft")}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu nháp
            </button>
            <button
              onClick={() => setStatus("published")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất bản
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề bài viết
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề bài viết..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chuyên mục
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            cat.id,
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((id) => id !== cat.id)
                          );
                        }
                      }}
                      className="mr-2"
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ảnh đại diện
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
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tóm tắt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tóm tắt bài viết..."
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội dung
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={post.content}
              init={{
                height: 500,
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
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/posts"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XCircle className="w-4 h-4 inline-block mr-2" />
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
