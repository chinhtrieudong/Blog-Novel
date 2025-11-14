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
import { NovelResponse } from "@/types/api";

export default function CreateChapterPage({
  params,
}: {
  params: { id: string };
}) {
  const [novel, setNovel] = useState<NovelResponse | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number | undefined>();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const { id } = params;

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      try {
        // Fetch novel data
        const novelResponse = await apiClient.getNovelById(parseInt(id));
        const novelData = novelResponse.data;

        // Check if user owns this novel or is admin
        if (novelData.author.id !== user.id && user.role !== "ADMIN") {
          setUnauthorized(true);
          return;
        }

        setNovel(novelData);

        // Get existing chapters to suggest next chapter number
        const chaptersResponse = await apiClient.getChapters(parseInt(id));
        const chapters = chaptersResponse.data || [];
        setChapterNumber(chapters.length + 1);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id, user, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chapterTitle.trim() || !content.trim()) {
      setError("Tiêu đề và nội dung chương không được để trống.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const chapterData = {
        title: chapterTitle.trim(),
        content: content.trim(),
        chapterNumber: chapterNumber,
      };

      await apiClient.createChapter(parseInt(id), chapterData);

      router.push(`/admin/novels/${id}/chapters`);
    } catch (err) {
      console.error("Failed to create chapter:", err);
      setError("Không thể tạo chương mới. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không có quyền truy cập
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn không có quyền chỉnh sửa tiểu thuyết này.
          </p>
          <Link
            href="/admin"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại bảng điều khiển
          </Link>
        </div>
      </div>
    );
  }

  if (!novel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy tiểu thuyết
          </h1>
          <Link
            href="/admin"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại bảng điều khiển
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
              href={`/admin/novels/${id}/chapters`}
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tạo chương mới
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tiểu thuyết: {novel.title}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề chương
            </label>
            <input
              type="text"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề chương..."
              required
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số thứ tự chương
            </label>
            <input
              type="number"
              value={chapterNumber || ""}
              onChange={(e) =>
                setChapterNumber(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Tự động"
              min="1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Để trống để tự động đánh số thứ tự
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội dung chương
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
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

          <div className="flex justify-end space-x-3">
            <Link
              href={`/admin/novels/${id}/chapters`}
              className="px-6 py-3 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XCircle className="w-4 h-4 inline-block mr-2" />
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 inline-block mr-2" />
                  Tạo chương
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
