"use client";

import { useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ChevronLeft, Save, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function NewNovelPage() {
  const [novelTitle, setNovelTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("draft");
  const [synopsis, setSynopsis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef<any>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [genres, setGenres] = useState<
    { id: number; name: string; description?: string }[]
  >([]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const content = editorRef.current?.getContent();

      const formData = new FormData();
      formData.append("title", novelTitle);
      formData.append("description", synopsis);
      formData.append("status", status);
      if (genre) formData.append("genreIds", genre);
      if (coverImage) formData.append("coverImage", coverImage);

      // TODO: Implement API call to create novel
      console.log("Creating novel:", {
        title: novelTitle,
        description: synopsis,
        genre,
        status,
        authorId: user.id,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect based on user role
      if (user.role === "ADMIN") {
        router.push("/admin/novels");
      } else {
        router.push("/novels");
      }
    } catch (error) {
      console.error("Error creating novel:", error);
      alert("Có lỗi xảy ra khi tạo tiểu thuyết. Vui lòng thử lại.");
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
              href="/admin"
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
              onClick={() => setStatus("draft")}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu Nháp
            </button>
            <button
              onClick={() => setStatus("published")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất Bản
            </button>
          </div>
        </div>
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
          {/* Author */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tác Giả
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>
          {/* Genre & Cover Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thể Loại
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Chọn thể loại</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
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
          </div>
          {/* Synopsis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tóm Tắt
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tóm tắt tiểu thuyết..."
            />
          </div>
          {/* Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội Dung
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
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
        </form>
      </div>
    </div>
  );
}
