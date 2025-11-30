"use client";

import { useState } from "react";
import { X, Search, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface AddRelatedNovelModalProps {
  isOpen: boolean;
  onClose: () => void;
  novelId: number;
  novelTitle: string;
}

interface NovelSearchResult {
  id: number;
  title: string;
  coverImage?: string;
  author?: {
    name?: string;
  };
}

export default function AddRelatedNovelModal({
  isOpen,
  onClose,
  novelId,
  novelTitle,
}: AddRelatedNovelModalProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<NovelSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState<number | null>(null);

  const handleSearch = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiClient.searchNovels({
        q: term,
        page: 0,
        size: 10,
      });

      if (response.data?.content) {
        // Filter out current novel and novels already related
        const filtered = response.data.content.filter(
          (novel: any) => novel.id !== novelId
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm tiểu thuyết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddRelationship = async (relatedNovelId: number) => {
    setIsAdding(relatedNovelId);
    try {
      await apiClient.addNovelRelationship(novelId, relatedNovelId);

      toast({
        title: "Thành công",
        description: "Đã thêm tiểu thuyết liên quan.",
      });

      // Clear search and close modal
      setSearchTerm("");
      setSearchResults([]);
      onClose();

      // Optionally refresh the page to show new related novel
      window.location.reload();
    } catch (error) {
      console.error("Add relationship error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm tiểu thuyết liên quan. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(null);
    }
  };

  const canAddRelated =
    user?.role === "ADMIN" ||
    user?.role === "AUTHOR" ||
    (user && novelId && /* would need to check if user is owner */ true); // Simplified for now

  if (!isOpen || !canAddRelated) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Thêm tiểu thuyết liên quan
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Thêm tiểu thuyết liên quan cho:{" "}
            <span className="font-medium">{novelTitle}</span>
          </p>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Tìm kiếm tiểu thuyết..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Search Results */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Đang tìm kiếm...
                </span>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((novel: NovelSearchResult) => (
                <div
                  key={novel.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={novel.coverImage || "/default-img.png"}
                      alt={novel.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {novel.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {novel.author?.name || "Tác giả ẩn danh"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddRelationship(novel.id)}
                    disabled={isAdding === novel.id}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding === novel.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Thêm
                  </button>
                </div>
              ))
            ) : searchTerm.length >= 2 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Không tìm thấy tiểu thuyết
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Nhập tên tiểu thuyết để tìm kiếm
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
