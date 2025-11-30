"use client";

import { useState } from "react";
import { MessageCircle, Heart } from "lucide-react";
import apiClient from "@/lib/api-client";
import { CommentResponse } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

interface CommentsProps {
  novelId: number;
  initialComments: CommentResponse[];
}

export default function Comments({ novelId, initialComments }: CommentsProps) {
  const [comments, setComments] = useState<CommentResponse[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likesLoading, setLikesLoading] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await apiClient.createNovelComment(novelId, {
        content: newComment.trim(),
      });

      if (response.data) {
        setComments([response.data, ...comments]); // Add to beginning
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      // You might want to show an error toast here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (likesLoading.has(commentId)) return;

    setLikesLoading((prev) => new Set([...prev, commentId]));

    try {
      await apiClient.likeComment(commentId);

      // Add to liked comments and reload comments to get updated like counts
      setLikedComments((prev) => new Set([...prev, commentId]));
      const response = await apiClient.getNovelComments(novelId);
      setComments(response.data || []);

      toast({
        title: "Thành công",
        description: "Đã thích bình luận!",
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thích bình luận. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLikesLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Bình luận ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          rows={3}
          required
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.user?.avatarUrl || "/placeholder-user.jpg"}
                alt={
                  comment.user?.fullName ||
                  comment.user?.username ||
                  "Không xác định"
                }
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.user?.fullName ||
                        comment.user?.username ||
                        "Người dùng ẩn danh"}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center mt-2 space-x-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    disabled={likesLoading.has(comment.id)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 ${
                        likesLoading.has(comment.id)
                          ? "animate-pulse"
                          : likedComments.has(comment.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span>{comment.likeCount || comment.likes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
