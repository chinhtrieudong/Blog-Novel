"use client";

import Link from "next/link";
import {
  BookOpen,
  PenTool,
  Users,
  Star,
  ArrowRight,
  Calendar,
  Eye,
  Loader2,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Quote,
} from "lucide-react";
import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [latestNovels, setLatestNovels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestContent();
  }, []);

  const fetchLatestContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch latest posts (only published ones)
      const postsResponse = await apiClient.getPosts({
        page: 0,
        size: 10,
        status: "PUBLISHED",
      });
      setLatestPosts(postsResponse.data.content || []);

      // Fetch latest novels
      const novelsResponse = await apiClient.getNovels({ page: 0, size: 10 });
      setLatestNovels(novelsResponse.data.content || []);
    } catch (err) {
      console.error("Failed to fetch latest content:", err);
      setError("Không thể tải nội dung mới nhất");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "3.5s" }}
          ></div>
          <div
            className="absolute top-1/3 right-10 w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce"
            style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Nền tảng sáng tạo văn học
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
              Chào mừng đến với{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Blog & Novel
              </span>
            </h1>

            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Nơi chia sẻ những câu chuyện, suy nghĩ và những tác phẩm tiểu
              thuyết độc đáo. Khám phá thế giới văn chương qua góc nhìn cá nhân
              và những trải nghiệm thú vị.
            </p>

            {/* Stats */}
            <div
              className="flex justify-center gap-8 mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  10K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Bài viết
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  5K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tiểu thuyết
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  50K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Độc giả
                </div>
              </div>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
              >
                <PenTool className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Khám phá Blog
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/novels"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 hover:scale-105 hover:shadow-2xl transition-all duration-300 transform"
              >
                <BookOpen className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Đọc Tiểu thuyết
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trải nghiệm đọc và chia sẻ tuyệt vời với những tính năng độc đáo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Blog Cá Nhân
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chia sẻ những suy nghĩ, trải nghiệm và kiến thức qua các bài
                viết blog chất lượng cao
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Tiểu Thuyết Nhiều Chương
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thưởng thức những tác phẩm tiểu thuyết dài tập với cốt truyện
                hấp dẫn và nhân vật sống động
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Cộng Đồng Độc Giả
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kết nối với những người yêu thích văn chương và chia sẻ cảm nhận
                về các tác phẩm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest Blog Posts */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Bài viết mới nhất
                </h2>
                <Link
                  href="/blog"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      Đang tải bài viết...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <button
                      onClick={fetchLatestContent}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : latestPosts.length > 0 ? (
                  latestPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="block"
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {post.createdAt
                              ? formatDate(post.createdAt)
                              : "N/A"}
                          </span>
                          <Eye className="w-4 h-4 ml-4 mr-1" />
                          <span>
                            {(
                              post.viewCount ||
                              post.views ||
                              0
                            ).toLocaleString()}{" "}
                            lượt xem
                          </span>
                          <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {post.categories?.length > 0
                              ? post.categories[0].name
                              : "Chưa phân loại"}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {post.excerpt ||
                            (post.content
                              ? post.content
                                  .replace(/<[^>]*>/g, "")
                                  .substring(0, 150) + "..."
                              : "Nội dung không có sẵn")}
                        </p>
                        <span className="text-blue-600 dark:text-blue-400 hover:underline">
                          Đọc tiếp →
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Chưa có bài viết nào.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Latest Novels */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tiểu thuyết mới nhất
                </h2>
                <Link
                  href="/novels"
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      Đang tải tiểu thuyết...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400 mb-2">
                      {error}
                    </p>
                    <button
                      onClick={fetchLatestContent}
                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Thử lại
                    </button>
                  </div>
                ) : latestNovels.length > 0 ? (
                  latestNovels.map((novel) => (
                    <Link
                      key={novel.id}
                      href={`/novels/${novel.id}`}
                      className="block"
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            <span>
                              {novel.avgRating || novel.rating || 0} (
                              {novel.viewCount || 0} lượt xem)
                            </span>
                          </div>
                          <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                            {novel.genres?.length > 0
                              ? novel.genres[0].name
                              : "Chưa phân loại"}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {novel.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {novel.description
                            ? novel.description.substring(0, 150) + "..."
                            : "Mô tả không có sẵn"}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {novel.totalChapters || 0} chương
                          </span>
                          <span className="text-purple-600 dark:text-purple-400 hover:underline">
                            Đọc ngay →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Chưa có tiểu thuyết nào.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated ? (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Bắt đầu hành trình khám phá ngay hôm nay
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Đăng ký tài khoản để không bỏ lỡ những nội dung mới nhất và tham
              gia cộng đồng độc giả
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Đăng ký ngay
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Chào mừng bạn quay trở lại!
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Tiếp tục hành trình sáng tạo và khám phá của bạn với cộng đồng
              chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/my-posts"
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Bài viết của tôi
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/my-novels"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Tiểu thuyết của tôi
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
