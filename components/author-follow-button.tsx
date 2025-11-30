"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface AuthorFollowButtonProps {
  authorId: number;
  authorName: string;
}

export default function AuthorFollowButton({
  authorId,
  authorName,
}: AuthorFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // Check initial follow status on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        const following = await apiClient.isFollowingAuthor(authorId);
        setIsFollowing(following);
      } catch (error) {
        console.error("Failed to check follow status:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkFollowStatus();
  }, [authorId, user]);

  const handleFollowToggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.followAuthor(authorId);

      // Determine new state and show appropriate message
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);

      // Show appropriate message based on new state
      if (newFollowingState) {
        toast.success(`Đã theo dõi tác giả ${authorName}`);
      } else {
        toast.success(`Đã bỏ theo dõi tác giả ${authorName}`);
      }
    } catch (error) {
      console.error("Failed to toggle follow author:", error);
      toast.error("❌ Không thể thực hiện thao tác này. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        disabled
        className="w-full py-2 rounded-lg transition-colors font-medium bg-gray-400 text-white cursor-not-allowed opacity-50"
      >
        Đang tải...
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`w-full py-2 rounded-lg transition-colors font-medium ${
        isFollowing
          ? "bg-orange-600 text-white hover:bg-orange-700"
          : "bg-purple-600 text-white hover:bg-purple-700"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading
        ? "Đang xử lý..."
        : isFollowing
        ? "Bỏ theo dõi"
        : "Theo dõi tác giả"}
    </button>
  );
}
