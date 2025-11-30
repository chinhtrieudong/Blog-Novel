"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Plus, Settings } from "lucide-react";
import AuthorFollowButton from "@/components/author-follow-button";
import AddRelatedNovelModal from "@/components/add-related-novel-modal";
import { useAuth } from "@/lib/auth-context";

interface NovelSidebarProps {
  novel: {
    id: number;
    title: string;
    author: {
      id: number;
      name: string;
      bio: string;
      avatarUrl?: string;
    };
  };
  relatedNovels: any[];
}

export default function NovelSidebar({
  novel,
  relatedNovels,
}: NovelSidebarProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canAddRelated =
    user?.role === "ADMIN" ||
    user?.role === "AUTHOR" ||
    user?.id === novel.author.id;

  return (
    <>
      {/* Sidebar */}
      <div className="lg:col-span-1">
        {/* Author Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Thông tin tác giả
          </h3>
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={novel.author.avatarUrl || "/placeholder.svg"}
              alt={novel.author.name}
              className="w-15 h-15 rounded-full"
            />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {novel.author.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tác giả
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {novel.author.bio}
          </p>
          <AuthorFollowButton
            authorId={novel.author.id}
            authorName={novel.author.name}
          />
        </div>

        {/* Related Novels */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Truyện liên quan
            </h3>
            {canAddRelated && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                title="Thêm tiểu thuyết liên quan"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-4">
            {relatedNovels.map((relatedNovel) => (
              <Link
                key={relatedNovel.id}
                href={`/novels/${relatedNovel.id}`}
                className="flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <img
                  src={relatedNovel.coverImage || "/default-img.png"}
                  alt={relatedNovel.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                    {relatedNovel.title}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Star className="w-3 h-3 mr-1 text-yellow-400" />
                    <span>{relatedNovel.avgRating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {relatedNovels.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chưa có tiểu thuyết liên quan
              </p>
              {canAddRelated && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 text-purple-600 dark:text-purple-400 hover:underline text-sm"
                >
                  Thêm tiểu thuyết liên quan
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddRelatedNovelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        novelId={novel.id}
        novelTitle={novel.title}
      />
    </>
  );
}
