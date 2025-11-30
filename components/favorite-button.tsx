"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface FavoriteButtonProps {
  novelId: number;
  novelTitle: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({
  novelId,
  novelTitle,
  size = "md",
  className = "",
  onToggle,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check favorite status on mount or when user changes
  useEffect(() => {
    if (user && novelId) {
      checkFavoriteStatus();
    } else {
      setIsFavorited(false);
    }
  }, [user, novelId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      // Try to check if this novel is in user's favorites by fetching favorite count
      // This is a simple check - if we can get novel data, we'll assume it's not favorited
      // In a real implementation, you'd have a dedicated endpoint to check favorite status
      const sessionKey = `user_${user.id}_favorited_${novelId}`;
      const wasFavoritedThisSession = localStorage.getItem(sessionKey);

      // Use localStorage as primary source, fallback to false
      setIsFavorited(!!wasFavoritedThisSession);
    } catch (error) {
      console.error("Failed to check favorite status:", error);
      setIsFavorited(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để thêm vào danh sách yêu thích.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasFavorited = isFavorited;

    // Optimistic update
    setIsFavorited(!wasFavorited);

    try {
      await apiClient.likeNovel(novelId);

      // Store favorite status in localStorage for persistence
      if (typeof window !== "undefined") {
        const sessionKey = `user_${user.id}_favorited_${novelId}`;
        if (!wasFavorited) {
          // User just favorited this - store it
          localStorage.setItem(sessionKey, "true");
        } else {
          // User just unfavorited this - remove it
          localStorage.removeItem(sessionKey);
        }
      }

      // Call onToggle callback if provided
      if (onToggle) {
        onToggle(!wasFavorited);
      }

      toast({
        title: wasFavorited ? "Đã bỏ yêu thích" : "Đã thêm yêu thích",
        description: `Tiểu thuyết "${novelTitle}" ${
          wasFavorited ? "đã được bỏ khỏi" : "đã được thêm vào"
        } danh sách yêu thích.`,
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);

      // Revert optimistic update on error
      setIsFavorited(wasFavorited);

      toast({
        title: "Lỗi",
        description:
          "Có lỗi xảy ra khi cập nhật danh sách yêu thích. Vui lòng thử lại.",
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
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={buttonClass}
      title={
        user
          ? isFavorited
            ? "Bỏ yêu thích"
            : "Thêm yêu thích"
          : "Đăng nhập để thêm vào yêu thích"
      }
    >
      <Heart
        className={`${iconSize[size]} ${
          isFavorited
            ? "text-red-500 fill-current"
            : "text-gray-600 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-300"
        } transition-colors`}
      />
    </button>
  );
}
