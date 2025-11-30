"use client";

import React from "react";
import FavoriteButton from "@/components/favorite-button";

interface FavoriteDisplayProps {
  novel: any;
}

export default function FavoriteDisplay({ novel }: FavoriteDisplayProps) {
  const [likeCount, setLikeCount] = React.useState<number>(
    novel.likeCount || 0
  );

  const handleFavoriteToggle = (isFavorited: boolean) => {
    // Update like count based on favorite action
    setLikeCount((prev: number) => (isFavorited ? prev + 1 : prev - 1));
  };

  return (
    <div className="flex items-center text-gray-600 dark:text-gray-400">
      <FavoriteButton
        novelId={novel.id}
        novelTitle={novel.title}
        size="sm"
        className="mr-1"
        onToggle={handleFavoriteToggle}
      />
      <span>{likeCount?.toLocaleString() || "0"} yêu thích</span>
    </div>
  );
}
