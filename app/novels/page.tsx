"use client";

import Link from "next/link";
import {
  Star,
  BookOpen,
  Users,
  Search,
  Filter,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { NovelResponse, PagedResponse, NovelStatus } from "@/types/api";

export default function NovelsPage() {
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const [genres, setGenres] = useState<
    { id: number; name: string; description?: string }[]
  >([]);
  const sortOptions = ["Mới nhất", "Phổ biến", "Đánh giá cao", "Hoàn thành"];

  useEffect(() => {
    fetchGenres();
    fetchNovels();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await apiClient.getGenres();
      const genreObjects = response.data.map((genre: any) => ({
        id: genre.id,
        name: genre.name,
        description: genre.description,
      }));
      setGenres([{ id: 0, name: "Tất cả" }, ...genreObjects]);
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      // Keep default genres if API fails
      setGenres([
        { id: 0, name: "Tất cả" },
        { id: 1, name: "Lãng mạn" },
        { id: 2, name: "Hành động" },
        { id: 3, name: "Trinh thám" },
        { id: 4, name: "Khoa học viễn tưởng" },
        { id: 5, name: "Fantasy" },
        { id: 6, name: "Kinh dị" },
      ]);
    }
  };

  const fetchNovels = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getNovels({ page: 0, size: 10 });
      setNovels(response.data.content || []);
    } catch (error) {
      console.error("Failed to fetch novels:", error);
      setError("Không thể tải danh sách tiểu thuyết");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNovels();
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.searchNovels({
        q: searchQuery,
        page: 0,
        size: 10,
      });

      // Search results have different structure - convert to display format
      const searchResults = response.data.content || [];
      const formattedResults = searchResults.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        author: { fullName: item.authorName, username: item.authorName },
        genres: [], // Not available in search results
        status: "ONGOING", // Default status
        coverImage: item.coverImage,
        totalViews: 0, // Not available in search results
        avgRating: item.avgRating || 0,
        totalChapters: 0, // Not available in search results
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setNovels(formattedResults);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Không thể tìm kiếm tiểu thuyết.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    setSearchQuery(""); // Clear search when filtering by genre
    fetchNovels(); // Refetch all novels and filter client-side
  };

  // Filter novels by selected genre (client-side filtering)
  const displayedNovels =
    selectedGenre === "Tất cả"
      ? novels
      : novels.filter((novel) =>
          novel.genres?.some((g: any) => g.name === selectedGenre)
        );

  const stats = {
    totalNovels: displayedNovels.length,
    completedNovels: displayedNovels.filter((n) => n.status === "COMPLETED")
      .length,
    ongoingNovels: displayedNovels.filter((n) => n.status === "ONGOING").length,
    totalViews: displayedNovels.reduce(
      (sum, n) => sum + (n.totalViews || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen py-8" data-page-type="novel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Thư Viện Tiểu Thuyết
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Khám phá những tác phẩm tiểu thuyết hấp dẫn với nhiều thể loại đa
            dạng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalNovels}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tổng tiểu thuyết
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completedNovels}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hoàn thành
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.ongoingNovels}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Đang cập nhật
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lượt đọc
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tiểu thuyết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tìm kiếm
            </button>
            <div className="relative inline-block">
              <select
                className="appearance-none px-4 pr-10 py-3 border border-gray-300 dark:border-gray-600
               rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:ring-2 focus:ring-purple-500 w-full"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Icon mũi tên custom */}
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <button className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc
            </button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreFilter(genre.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedGenre === genre.name
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Novels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedNovels.map((novel) => (
            <Link key={novel.id} href={`/novels/${novel.id}`} className="block">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className="flex">
                  <div className="w-32 h-48 flex-shrink-0">
                    <img
                      src={novel.coverImage || "/placeholder.svg"}
                      alt={novel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          novel.status === "COMPLETED"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        }`}
                      >
                        {novel.status === "COMPLETED"
                          ? "Hoàn thành"
                          : novel.status === "ONGOING"
                          ? "Đang cập nhật"
                          : novel.status === "DRAFT"
                          ? "Nháp"
                          : novel.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Cập nhật gần đây
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {novel.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {novel.author.fullName || novel.author.username}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {novel.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {novel.genres[0]?.name || "Chưa phân loại"}
                      </span>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        <span>{novel.totalChapters || 0} chương</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        <span>{novel.avgRating || 0} (Chưa có đánh giá)</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{(novel.totalViews || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm">
                      Đọc ngay →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Trending Section */}
        <div className="mt-16">
          <div className="flex items-center mb-8">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Xu hướng tuần này
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {novels.slice(0, 4).map((novel, index) => (
              <div
                key={novel.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center mb-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                      {novel.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      <span>{novel.avgRating}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/novels/${novel.id}`}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        </div>

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
                    ? "bg-purple-600 text-white"
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
  );
}
