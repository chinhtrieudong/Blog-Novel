"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface StarRatingProps {
  novelId: number;
  initialRating?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({
  novelId,
  initialRating = 0,
  size = "md",
  readonly = false,
  onRatingChange,
}: StarRatingProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (newRating: number) => {
    if (readonly || !user) {
      if (!user) {
        toast({
          title: "Yêu cầu đăng nhập",
          description: "Bạn cần đăng nhập để đánh giá tiểu thuyết.",
          variant: "destructive",
        });
      }
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    const previousRating = rating;

    // Optimistic update
    setRating(newRating);
    onRatingChange?.(newRating);

    try {
      await apiClient.rateNovel(novelId, newRating);

      toast({
        title: "Đã đánh giá",
        description: `Bạn đã đánh giá tiểu thuyết ${newRating} sao.`,
      });
    } catch (error) {
      console.error("Failed to rate novel:", error);

      // Revert optimistic update on error
      setRating(previousRating);
      onRatingChange?.(previousRating);

      toast({
        title: "Lỗi",
        description:
          "Có lỗi xảy ra khi đánh giá tiểu thuyết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const starSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly || isSubmitting}
          onClick={() => handleRating(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`transition-colors ${
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
          }`}
          title={
            readonly
              ? `${rating} sao`
              : user
              ? `Đánh giá ${star} sao`
              : "Đăng nhập để đánh giá"
          }
        >
          <Star
            className={`${starSize[size]} ${
              star <= (hoverRating || rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            } transition-colors`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating}/5
        </span>
      )}
    </div>
  );
}
