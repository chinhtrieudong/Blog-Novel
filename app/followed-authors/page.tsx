"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";

interface FollowedAuthor {
  id: number;
  name: string;
  bio: string;
  avatarUrl: string;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function FollowedAuthorsPage() {
  const [authors, setAuthors] = useState<FollowedAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFollowedAuthors();
    }
  }, [user]);

  const fetchFollowedAuthors = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      console.log("Fetching followed authors for user:", user.id);

      const response = await apiClient.getFollowedAuthors();
      console.log("API Response:", response);

      if (response && response.data) {
        setAuthors(response.data || []);
        console.log("Followed authors loaded:", response.data?.length || 0);
      } else {
        console.warn("Invalid API response structure:", response);
        setError("Phản hồi API không hợp lệ.");
      }
    } catch (err) {
      console.error("Failed to fetch followed authors:", err);
      setError(
        "Không thể tải danh sách tác giả đã follow. Vui lòng thử lại sau."
      );
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

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Đang tải danh sách tác giả...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tác giả đã follow
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Danh sách các tác giả bạn đang theo dõi
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchFollowedAuthors}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Authors Grid */}
        {!error && (
          <>
            {authors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bạn chưa follow tác giả nào.
                </p>
                <Link
                  href="/novels"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Khám phá tác giả
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {authors.map((author) => (
                  <article
                    key={author.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
                  >
                    <div className="p-6">
                      {/* Avatar */}
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4">
                          {author.avatarUrl ? (
                            <img
                              src={author.avatarUrl}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
                                {(author.name || "A").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {author.name}
                          </h2>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-1" />
                            <span>
                              {author.followerCount || 0} người theo dõi
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {author.bio || "Chưa có giới thiệu"}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Tham gia: {formatDate(author.createdAt)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/authors/${author.id}`}
                        className="w-full flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Xem tiểu thuyết
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
