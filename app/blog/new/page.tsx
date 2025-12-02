"use client";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ChevronLeft, Save, Send, Upload } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { CategoryMultiSelect } from "@/components/ui/category-multi-select";
import { TagMultiSelect } from "@/components/ui/tag-multi-select";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("PENDING_REVIEW");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<
    { id: number; name: string; description?: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch categories and set tags on component mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && user) {
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
            { id: 3, name: "Kinh nghiệm", slug: "kinh-nghiem" },
          ]);
        }
      };
      fetchCategories();

      // Set hardcoded tags (TODO: fetch from API if available)
      setTags([
        { id: 1, name: "AI", description: "Trí tuệ nhân tạo" },
        { id: 2, name: "Blockchain", description: "Công nghệ chuỗi khối" },
        { id: 3, name: "Metaverse", description: "Metaverse" },
        { id: 4, name: "Công nghệ", description: "Công nghệ" },
        { id: 5, name: "Cuộc sống", description: "Cuộc sống" },
        { id: 6, name: "Kinh nghiệm", description: "Kinh nghiệm" },
      ]);
    }
  }, [isAuthenticated, user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
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

      // Get editor content
      const editorContent = editorRef.current?.getContent() || "";
      formData.append("content", editorContent);

      // Add categories and tags
      categoryIds.forEach((id: number) => {
        formData.append("categoryIds", id.toString());
      });

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

      const response = await apiClient.createPostFromFormData(formData);

      router.push("/blog");
    } catch (err: any) {
      setError(
        err.message || "Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setStatus("DRAFT");
    formRef.current?.requestSubmit();
  };

  const handlePublish = () => {
    setStatus("PUBLISHED");
    formRef.current?.requestSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/blog"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Viết Bài Viết Mới
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu Nháp
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất Bản
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
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
              <CategoryMultiSelect
                value={categoryIds}
                onChange={setCategoryIds}
                categories={categories}
                placeholder="Chọn danh mục..."
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Tùy chọn)
              </label>
              <TagMultiSelect
                value={tagIds}
                onChange={setTagIds}
                tags={tags}
                placeholder="Chọn tags..."
              />
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
              readonly={false}
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
              type="button"
              onClick={handlePublish}
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
