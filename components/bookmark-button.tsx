"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface BookmarkButtonProps {
  postId: number;
  postTitle: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BookmarkButton({
  postId,
  postTitle,
  size = "md",
  className = "",
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check bookmark status on mount or when user changes
  useEffect(() => {
    if (user && postId) {
      checkBookmarkStatus();
    }
  }, [user, postId]);

  const checkBookmarkStatus = () => {
    if (!user) return;

    // Pure client-side persistence using localStorage
    if (typeof window !== "undefined") {
      const sessionKey = `user_${user.id}_bookmarked_${postId}`;
      const wasBookmarkedThisSession = localStorage.getItem(sessionKey);
      setIsBookmarked(!!wasBookmarkedThisSession);
    }
  };

  const handleToggleBookmark = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để lưu bài viết.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasBookmarked = isBookmarked;

    // Optimistic update
    setIsBookmarked(!wasBookmarked);

    try {
      await apiClient.savePost(postId);

      // Store bookmark status in localStorage for persistence
      if (typeof window !== "undefined") {
        const sessionKey = `user_${user.id}_bookmarked_${postId}`;
        if (!wasBookmarked) {
          // User just bookmarked this - store it
          localStorage.setItem(sessionKey, "true");
        } else {
          // User just unbookmarked this - remove it
          localStorage.removeItem(sessionKey);
        }
      }

      toast({
        title: wasBookmarked ? "Đã bỏ lưu" : "Đã lưu",
        description: `Bài viết "${postTitle}" ${
          wasBookmarked ? "đã được bỏ lưu" : "đã được lưu để đọc sau"
        }.`,
      });
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);

      // Revert optimistic update on error
      setIsBookmarked(wasBookmarked);

      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonClass =
    size === "sm"
      ? `p-1 rounded-full transition-all hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`
      : `p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`;

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={buttonClass}
      title={
        user
          ? isBookmarked
            ? "Bỏ lưu"
            : "Lưu để đọc sau"
          : "Đăng nhập để lưu bài viết"
      }
    >
      <Bookmark
        className={`${iconSize[size]} ${
          isBookmarked
            ? "text-blue-500 fill-current"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300"
        } transition-colors`}
      />
    </button>
  );
}
