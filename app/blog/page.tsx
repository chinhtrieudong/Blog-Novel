"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Eye,
  Tag,
  Search,
  Filter,
  Loader2,
  TrendingUp,
  Clock,
  User,
  Heart,
  Share2,
  Bookmark,
  Star,
  Sparkles,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { PostResponse, CategoryResponse, PostQueryParams } from "@/types/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [categoryNames, setCategoryNames] = useState<string[]>(["Tất cả"]);
  const [categoryMapping, setCategoryMapping] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response && response.data) {
        const categoryNamesList = response.data.map((cat: any) => cat.name);

        const mapping: { [key: string]: number } = {};
        response.data.forEach((cat: any) => {
          mapping[cat.name] = cat.id;
        });
        setCategoryMapping(mapping);

        setCategoryNames(["Tất cả", ...categoryNamesList]);
      } else {
        throw new Error("Categories API not available");
      }
    } catch (err) {
      setCategoryNames([
        "Tất cả",
        "Công nghệ",
        "Đời sống",
        "Du lịch",
        "Sách",
        "Phim ảnh",
        "Ẩm thực",
        "Sức khỏe",
      ]);

      setCategoryMapping({
        "Công nghệ": 1,
        "Đời sống": 2,
        "Du lịch": 3,
        Sách: 4,
        "Phim ảnh": 5,
        "Ẩm thực": 6,
        "Sức khỏe": 7,
      });
    }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const params: PostQueryParams = {
        page: currentPage - 1,
        size: 10,
        status: "PUBLISHED",
      };

      if (selectedCategory && selectedCategory !== "Tất cả") {
        const categoryId = categoryMapping[selectedCategory];
        if (categoryId) {
          params.categoryId = categoryId;
        }
      }

      const response = await apiClient.getPosts(params);
      setPosts(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Không thể tải bài viết. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.searchPosts({
        q: searchQuery,
        page: 0,
        size: 10,
      });

      const searchResults = response.data.content || [];
      const formattedResults = searchResults.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.excerpt || "Nội dung không có sẵn",
        excerpt: item.excerpt,
        coverImage: item.coverImage,
        authorId: item.authorId,
        authorName: item.authorName,
        categories: item.categories || [],
        tags: item.tags || [],
        viewCount: item.viewCount || 0,
        status: item.status || "published",
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));

      setPosts(formattedResults);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      setError("Không thể tìm kiếm bài viết.");
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

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} phút đọc`;
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  // Get featured posts (top 3 by view count)
  const featuredPosts = posts
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-800 dark:text-blue-200 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              Không gian sáng tạo
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up">
              Blog{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cá Nhân
              </span>
            </h1>

            <p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Chia sẻ những suy nghĩ, trải nghiệm và kiến thức qua các bài viết
              chất lượng. Khám phá thế giới quan điểm đa dạng và góc nhìn độc
              đáo.
            </p>

            {/* Stats */}
            <div
              className="flex justify-center gap-8 mb-10 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {posts.length}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Bài viết
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {categoryNames.length - 1}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Chủ đề
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cập nhật
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {!isLoading && !error && featuredPosts.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <TrendingUp className="w-6 h-6 text-orange-500 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bài viết nổi bật
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="block group"
                >
                  <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden">
                    {/* Featured Badge */}
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
                        <img
                          src={
                            post.coverImageUrl ||
                            post.coverImage ||
                            "/placeholder.svg"
                          }
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          Nổi bật #{index + 1}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.categories?.length > 0
                            ? post.categories[0].name
                            : "Chưa phân loại"}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.viewCount?.toLocaleString() || "0"}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt ||
                          (post.content
                            ? stripHtmlTags(post.content).substring(0, 120) +
                              "..."
                            : "Nội dung không có sẵn")}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          <span>{post.authorName || "Ẩn danh"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {post.content
                              ? calculateReadTime(post.content)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
              <button className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-5 h-5 mr-2" />
                Bộ lọc
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Đang tải bài viết...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="block">
                  <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={
                          post.coverImageUrl ||
                          post.coverImage ||
                          "/placeholder.svg"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.categories?.length > 0
                            ? post.categories[0].name
                            : "Chưa phân loại"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.content
                            ? calculateReadTime(post.content)
                            : "N/A"}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.excerpt ||
                          (post.content
                            ? stripHtmlTags(post.content).substring(0, 150) +
                              "..."
                            : "Nội dung không có sẵn")}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {post.status === "PUBLISHED"
                              ? formatDate(post.updatedAt)
                              : "Chưa xuất bản"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>
                            {post.viewCount
                              ? post.viewCount.toLocaleString()
                              : "0"}{" "}
                            lượt xem
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        Đọc tiếp →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Không có bài viết nào để hiển thị.
              </p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Tải lại dữ liệu
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                Trước
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-3 py-2 rounded-lg ${
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
