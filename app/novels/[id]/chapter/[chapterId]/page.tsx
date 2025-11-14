"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  Settings,
  Type,
  Moon,
  Sun,
  Loader2,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { NovelResponse, ChapterResponse, CommentResponse } from "@/types/api";

export default function ChapterDetailPage({
  params,
}: {
  params: Promise<{ id: string; chapterId: string }>;
}) {
  const [novelId, setNovelId] = useState<number | null>(null);
  const [chapterId, setChapterId] = useState<number | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setNovelId(parseInt(resolved.id));
      setChapterId(parseInt(resolved.chapterId));
    }
    resolveParams();
  }, [params]);

  const [novel, setNovel] = useState<NovelResponse | null>(null);
  const [chapter, setChapter] = useState<ChapterResponse | null>(null);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [chapterComments, setChapterComments] = useState<CommentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!novelId || !chapterId) return;

    async function fetchData() {
      try {
        // Fetch novel data
        const novelResponse = await apiClient.getNovelById(novelId!);
        if (!novelResponse.data) {
          notFound();
        }
        setNovel(novelResponse.data);

        // Increment chapter views
        try {
          console.log("Incrementing chapter views for chapter:", chapterId);
          await apiClient.incrementChapterViews(novelId!, chapterId!);
          console.log("Chapter views incremented successfully");
        } catch (error) {
          console.error("Failed to increment chapter views:", error);
          // Don't fail the page load if view increment fails
        }

        // Increment novel views
        try {
          console.log("Incrementing novel views for novel:", novelId);
          await apiClient.incrementNovelViews(novelId!);
          console.log("Novel views incremented successfully");
        } catch (error) {
          console.error("Failed to increment novel views:", error);
          // Don't fail the page load if view increment fails
        }

        // Fetch chapter data
        const chapterResponse = await apiClient.getChapterById(
          novelId!,
          chapterId!
        );
        if (!chapterResponse.data) {
          notFound();
        }
        setChapter(chapterResponse.data);

        // Fetch all chapters for navigation
        const chaptersResponse = await apiClient.getChapters(novelId!);
        setChapters(chaptersResponse.data || []);

        // Fetch chapter comments
        const commentsResponse = await apiClient.getChapterComments(
          novelId!,
          chapterId!
        );
        setChapterComments(commentsResponse.data || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [novelId, chapterId]);

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

  if (error || !novel || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Không tìm thấy chương"}
          </h1>
          <Link
            href={`/novels/${novelId}`}
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại tiểu thuyết
          </Link>
        </div>
      </div>
    );
  }

  // Find previous and next chapters
  const currentIndex = chapters.findIndex((ch) => ch.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      data-page-type="novel"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/novels/${novel.id}`}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {novel.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chapter.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Type className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Moon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          {/* Chapter Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {new Date(chapter.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>
                  {chapter.viewCount?.toLocaleString() ?? "0"} lượt đọc
                </span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{chapter.wordCount?.toLocaleString() ?? "0"} từ</span>
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />

          {/* Chapter Actions */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                <Heart className="w-5 h-5" />
                <span>{chapter.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <MessageCircle className="w-5 h-5" />
                <span>{chapterComments.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          {prevChapter ? (
            <Link
              href={`/novels/${novel.id}/chapter/${prevChapter.id}`}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Chương trước</span>
            </Link>
          ) : (
            <div></div>
          )}

          <Link
            href={`/novels/${novel.id}`}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Danh sách chương
          </Link>

          {nextChapter ? (
            <Link
              href={`/novels/${novel.id}/chapter/${nextChapter.id}`}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span>Chương tiếp</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Bình luận ({chapterComments.length})
          </h3>

          {/* Comment Form */}
          <div className="mb-6">
            <textarea
              placeholder="Viết bình luận của bạn..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex justify-end mt-2">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Gửi bình luận
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {chapterComments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </p>
            ) : (
              chapterComments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <img
                    src={comment.user?.avatarUrl || "/placeholder.svg"}
                    alt={comment.user?.username || "User"}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {comment.user?.username || "Anonymous"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                        <Heart className="w-4 h-4 mr-1" />
                        {comment.likes}
                      </button>
                      <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
