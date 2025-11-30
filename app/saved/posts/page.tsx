"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { PostResponse } from "@/types/api";
import {
  Calendar,
  Eye,
  Tag,
  BookOpen,
  Bookmark,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedPostsPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSavedPosts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchSavedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getSavedPosts({
        page: 0,
        size: 20, // Load more posts
      });

      if (response.data?.content) {
        setPosts(response.data.content);
      }
    } catch (error) {
      console.error("Failed to fetch saved posts:", error);
      setError("Không thể tải danh sách bài viết đã lưu. Vui lòng thử lại.");
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài viết đã lưu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
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
              Bạn cần đăng nhập để xem danh sách bài viết đã lưu.
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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.categories?.some((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      post.tags?.some((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bookmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Bài viết đã lưu
          </h1>
        </div>
        <p className="text-muted-foreground">
          Quản lý danh sách {posts.length} bài viết yêu thích của bạn
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên bài viết, tác giả hoặc thẻ..."
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
            onClick={fetchSavedPosts}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {posts.length}
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
                  {posts.reduce((sum, post) => sum + (post.viewCount || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Tổng lượt xem</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <span className="text-amber-600 dark:text-amber-400">♥</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {posts.reduce((sum, post) => sum + (post.likes || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Tổng likes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
                <Tag className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(posts.flatMap((post) => post.tags || [])).size}
                </p>
                <p className="text-xs text-muted-foreground">Thẻ khác nhau</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Đang tải danh sách bài viết...
          </p>
        </div>
      ) : filteredPosts.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium text-foreground">
            {searchQuery
              ? "Không tìm thấy kết quả"
              : "Chưa có bài viết nào được lưu"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery
              ? "Thử tìm kiếm với từ khóa khác"
              : "Hãy khám phá và lưu các bài viết thú vị để đọc sau."}
          </p>
          {!searchQuery && (
            <Link
              href="/blog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Khám phá bài viết
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden transition-shadow hover:shadow-md group"
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Cover */}
                  <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-28">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <Link href={`/blog/${post.id}`}>
                          <h3 className="line-clamp-1 text-lg font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={async () => {
                            try {
                              // Call the save endpoint again to toggle (unsave)
                              await apiClient.savePost(post.id);
                              toast({
                                title: "Đã xóa",
                                description: `Đã xóa "${post.title}" khỏi danh sách lưu.`,
                              });
                              // Refresh the list
                              fetchSavedPosts();
                            } catch (error) {
                              console.error("Failed to unsave post:", error);
                              toast({
                                title: "Lỗi",
                                description:
                                  "Không thể xóa bài viết khỏi danh sách lưu.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {post.authorName}
                      </p>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        {post.categories && post.categories.length > 0 && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {post.categories[0].name}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-sm text-amber-500">
                          <span className="text-red-500">♥</span>
                          <span>{post.likes || 0}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {decodeHtmlEntities(post.excerpt || post.title)}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>
                          <Calendar className="mr-1 inline h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span>
                          <Eye className="mr-1 inline h-3 w-3" />
                          {post.viewCount?.toLocaleString()} lượt xem
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Đọc tiếp →
                      </Link>
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
