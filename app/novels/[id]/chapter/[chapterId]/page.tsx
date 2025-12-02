"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
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
  X,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { NovelResponse, ChapterResponse, CommentResponse } from "@/types/api";
import CommentsSection from "@/components/comments-section";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const router = useRouter();

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

        // Update reading progress for progress tracking
        try {
          console.log("run here to update progress");
          console.log("Updating reading progress for chapter:", chapterId);

          // First, check if this novel has reading progress (i.e., it's saved)
          console.log("Getting reading progress...");
          const progressResponse = await apiClient.getUserReadingProgress();
          console.log("Reading progress response:", progressResponse);

          if (progressResponse.data?.progressList) {
            // Find if this novel has progress tracking
            const novelProgress = progressResponse.data.progressList.find(
              (progress: any) => progress.novelId === novelId
            );
            console.log("Found novel progress:", novelProgress);

            if (novelProgress) {
              // Novel has progress tracking, update it
              console.log("run here to update progress");

              // Get all chapters to determine the sequential chapter number
              console.log("Getting chapters list for chapter numbering...");
              const chaptersResponse = await apiClient.getChapters(novelId!);
              const allChapters = chaptersResponse.data || [];
              console.log("Chapters response:", allChapters.length, "chapters");

              // Find the position of current chapter in the sorted list
              const currentChapterIndex = allChapters.findIndex(
                (ch: any) => ch.id === chapterId
              );
              console.log("Current chapter index:", currentChapterIndex);

              // Use sequential chapter number (1-based) instead of chapter ID
              const readChapters =
                currentChapterIndex !== -1
                  ? currentChapterIndex + 1
                  : chapterId!;
              const lastRead = new Date().toISOString();
              console.log(
                "Using sequential chapter number as readChapters:",
                readChapters,
                "lastRead:",
                lastRead
              );

              // Use the novelId from progress as the saved novel ID
              const novelSaveId = novelProgress.novelId;
              console.log(
                "Using novelId from progress as novelSaveId:",
                novelSaveId
              );

              console.log("Calling updateReadingProgress API...");
              await apiClient.updateReadingProgress(
                novelSaveId,
                readChapters,
                lastRead
              );
              console.log("Reading progress updated successfully");
            } else {
              console.log(
                "Novel not found in reading progress - not saved by user"
              );
            }
          } else {
            console.log("No reading progress data available");
          }
        } catch (error) {
          console.error("Failed to update reading progress:", error);
          // Don't fail the page load if progress update fails
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

        // Comments will be loaded by CommentsSection component
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

  // Calculate word count from chapter content
  const calculateWordCount = (htmlContent: string): number => {
    if (!htmlContent) return 0;

    // Remove HTML tags and decode HTML entities
    const textContent = htmlContent
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
      .replace(/&[a-zA-Z0-9#]+;/g, " ") // Replace other HTML entities
      .trim();

    // Split by whitespace and filter out empty strings
    const words = textContent.split(/\s+/).filter((word) => word.length > 0);
    return words.length;
  };

  const wordCount = chapter ? calculateWordCount(chapter.content) : 0;

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
                <span>{wordCount.toLocaleString()} từ</span>
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
                <span>Bình luận</span>
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

          <button
            onClick={() => setIsChapterModalOpen(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Danh sách chương
          </button>

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
        {novelId && chapterId && (
          <CommentsSection
            postId={novelId}
            contentType="chapter"
            chapterId={chapterId}
            initialComments={[]}
          />
        )}
      </div>

      {/* Chapter List Modal */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Danh sách chương - {novel.title}
                </h2>
                <button
                  onClick={() => setIsChapterModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tổng cộng {chapters.length} chương
              </p>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              <div className="space-y-2">
                {chapters.map((chapterItem, index) => (
                  <button
                    key={chapterItem.id}
                    onClick={() => {
                      setIsChapterModalOpen(false);
                      router.push(
                        `/novels/${novel.id}/chapter/${chapterItem.id}`
                      );
                    }}
                    className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group ${
                      chapterItem.id === chapterId
                        ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className={`font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 ${
                            chapterItem.id === chapterId
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          Chương {index + 1}: {chapterItem.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {chapterItem.createdAt
                              ? new Date(
                                  chapterItem.createdAt
                                ).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </span>
                          <Eye className="w-4 h-4 ml-4 mr-1" />
                          <span>{chapterItem.viewCount || 0} lượt đọc</span>
                        </div>
                      </div>
                      {chapterItem.id === chapterId && (
                        <div className="text-purple-600 dark:text-purple-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Link
                  href={`/novels/${novel.id}`}
                  onClick={() => setIsChapterModalOpen(false)}
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Xem trang tiểu thuyết
                </Link>
                <button
                  onClick={() => setIsChapterModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
