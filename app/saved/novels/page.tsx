"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { NovelResponse } from "@/types/api";
import {
  BookOpen,
  Bookmark,
  Search,
  Trash2,
  Clock,
  Eye,
  Star,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReadingProgressItem {
  novelId: number;
  novelTitle: string;
  novelSlug: string;
  coverImage?: string;
  totalChapters: number;
  readChapters: number;
  savedAt: string;
  lastRead: string | null;
  status: "reading" | "completed" | "unread";
  progressPercentage: number;
}

interface ReadingProgressResponse {
  totalSaved: number;
  completed: number;
  reading: number;
  unread: number;
  progressList: ReadingProgressItem[];
}

export default function SavedNovelsPage() {
  const { user, isAuthenticated } = useAuth();
  const [readingProgress, setReadingProgress] =
    useState<ReadingProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReadingProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchReadingProgress = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getUserReadingProgress();

      if (response.data) {
        setReadingProgress(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch reading progress:", error);
      setError("Không thể tải tiến độ đọc. Vui lòng thử lại.");
      toast({
        title: "Lỗi",
        description: "Không thể tải tiến độ đọc.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Yêu cầu đăng nhập
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn cần đăng nhập để xem danh sách tiểu thuyết đã lưu.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Đang tải danh sách tiểu thuyết...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filteredProgress =
    readingProgress?.progressList.filter(
      (item) =>
        item.novelTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.novelSlug.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bookmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Novel Đã Lưu</h1>
        </div>
        <p className="text-muted-foreground">
          Quản lý danh sách {readingProgress?.totalSaved || 0} novel yêu thích
          của bạn
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên truyện..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-400">{error}</p>
          <button
            onClick={fetchReadingProgress}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && readingProgress && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {readingProgress.totalSaved}
                </p>
                <p className="text-xs text-muted-foreground">Đã lưu</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {readingProgress.completed}
                </p>
                <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {readingProgress.reading}
                </p>
                <p className="text-xs text-muted-foreground">Đang đọc</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
                <Bookmark className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {readingProgress.unread}
                </p>
                <p className="text-xs text-muted-foreground">Chưa đọc</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Novel List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Đang tải danh sách tiểu thuyết...
          </p>
        </div>
      ) : filteredProgress.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium text-foreground">
            {searchQuery
              ? "Không tìm thấy kết quả"
              : "Chưa có novel nào được lưu"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Hãy khám phá và lưu các novel thú vị để đọc sau."}
          </p>
          {!searchQuery && (
            <Link
              href="/novels"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Khám phá novel
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProgress.map((item) => (
            <Card
              key={item.novelId}
              className="overflow-hidden transition-shadow hover:shadow-md group"
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Cover */}
                  <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-28">
                    <img
                      src={item.coverImage || "/placeholder.svg"}
                      alt={item.novelTitle}
                      className="h-full w-full object-cover group-hover:brightness-110 transition-all duration-300"
                    />
                    {item.status === "completed" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="text-xs font-medium text-white">
                          Hoàn thành
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <Link href={`/novels/${item.novelId}`}>
                          <h3 className="line-clamp-1 text-lg font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {item.novelTitle}
                          </h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={async () => {
                            try {
                              // Call the save endpoint again to toggle (unsave)
                              await apiClient.saveNovel(item.novelId);
                              toast({
                                title: "Đã xóa",
                                description: `Đã xóa "${item.novelTitle}" khỏi danh sách lưu.`,
                              });
                              // Refresh the list
                              fetchReadingProgress();
                            } catch (error) {
                              console.error("Failed to unsave novel:", error);
                              toast({
                                title: "Lỗi",
                                description:
                                  "Không thể xóa novel khỏi danh sách lưu.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`${
                            item.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : item.status === "reading"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
                          }`}
                        >
                          {item.status === "completed"
                            ? "Hoàn thành"
                            : item.status === "reading"
                            ? "Đang đọc"
                            : "Chưa đọc"}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Tiến độ: {item.progressPercentage}% (
                          {item.readChapters}/{item.totalChapters} chương)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${item.progressPercentage}%`,
                          }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          <Clock className="mr-1 inline h-3 w-3" />
                          Lưu lúc:{" "}
                          {new Date(item.savedAt).toLocaleDateString("vi-VN")}
                        </span>
                        {item.lastRead && (
                          <span>
                            Đọc cuối:{" "}
                            {new Date(item.lastRead).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
