"use client";

import React, { useState, useEffect } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  postId: number;
  title: string;
  description?: string;
  className?: string;
}

export default function ShareButton({
  postId,
  title,
  description = "",
  className = "",
}: ShareButtonProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/blog/${postId}`);
    }
  }, [postId]);

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: description || title,
      url: url,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Đã chia sẻ",
          description: "Bài viết đã được chia sẻ thành công.",
        });
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Đã sao chép",
        description: "Đường dẫn bài viết đã được sao chép vào clipboard.",
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Lỗi",
        description: "Không thể sao chép đường dẫn. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ${className}`}
      title="Chia sẻ bài viết"
    >
      {copied ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Share2 className="w-5 h-5" />
      )}
      <span>Chia sẻ</span>
    </button>
  );
}
