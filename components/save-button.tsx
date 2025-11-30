"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface SaveButtonProps {
  novelId: number;
  novelTitle: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SaveButton({
  novelId,
  novelTitle,
  size = "md",
  className = "",
}: SaveButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check save status on mount or when user changes
  useEffect(() => {
    if (user && novelId) {
      checkSaveStatus();
    }
  }, [user, novelId]);

  const checkSaveStatus = () => {
    if (!user) return;

    // Pure client-side persistence using localStorage
    if (typeof window !== "undefined") {
      const sessionKey = `user_${user.id}_saved_${novelId}`;
      const wasSavedThisSession = localStorage.getItem(sessionKey);
      setIsSaved(!!wasSavedThisSession);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để lưu tiểu thuyết.",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const wasSaved = isSaved;

    // Optimistic update
    setIsSaved(!wasSaved);

    try {
      await apiClient.saveNovel(novelId);

      // Store save status in localStorage for persistence
      if (typeof window !== "undefined") {
        const sessionKey = `user_${user.id}_saved_${novelId}`;
        if (!wasSaved) {
          // User just saved this - store it
          localStorage.setItem(sessionKey, "true");
        } else {
          // User just unsaved this - remove it
          localStorage.removeItem(sessionKey);
        }
      }

      toast({
        title: wasSaved ? "Đã bỏ lưu" : "Đã lưu",
        description: `Tiểu thuyết "${novelTitle}" ${
          wasSaved ? "đã được bỏ lưu" : "đã được lưu để đọc sau"
        }.`,
      });
    } catch (error) {
      console.error("Failed to toggle save:", error);

      // Revert optimistic update on error
      setIsSaved(wasSaved);

      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu tiểu thuyết. Vui lòng thử lại.",
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
      onClick={handleToggleSave}
      disabled={isLoading}
      className={buttonClass}
      title={
        user
          ? isSaved
            ? "Bỏ lưu"
            : "Lưu để đọc sau"
          : "Đăng nhập để lưu tiểu thuyết"
      }
    >
      <Bookmark
        className={`${iconSize[size]} ${
          isSaved
            ? "text-blue-500 fill-current"
            : "text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300"
        } transition-colors`}
      />
    </button>
  );
}
