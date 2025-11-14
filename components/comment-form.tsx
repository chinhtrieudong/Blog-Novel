"use client";

import { useState } from "react";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
  postId: number;
  onCommentAdded?: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bình luận");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.createPostComment(postId, {
        content: content.trim(),
      });

      setContent("");
      // Refresh comments by calling the parent handler
      onCommentAdded?.();
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Không thể gửi bình luận. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Viết bình luận của bạn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[100px] resize-none"
        disabled={isSubmitting}
        required
      />

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">{content.length}/500 ký tự</div>
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting || content.length > 500}
          className="flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
        </Button>
      </div>
    </form>
  );
}
