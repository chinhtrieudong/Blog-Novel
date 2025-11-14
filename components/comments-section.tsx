"use client";

import { useState, useEffect } from "react";
import { CommentResponse } from "@/types/api";
import CommentForm from "./comment-form";
import apiClient from "@/lib/api-client";
import { Loader2, Heart, MessageCircle, User } from "lucide-react";

interface CommentsSectionProps {
  postId: number;
  initialComments: CommentResponse[];
}

export default function CommentsSection({
  postId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getPostComments(postId);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error loading comments:", error);
      setError("Không thể tải bình luận.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleCommentAdded = () => {
    // Reload comments after adding a new one
    loadComments(false);
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Bình luận ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4">
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button
            onClick={() => loadComments()}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Comments List */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {comments.map((comment: CommentResponse) => (
            <div key={comment.id} className="flex space-x-4">
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
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.user?.fullName ||
                      comment.user?.username ||
                      "Người dùng ẩn danh"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    <Heart className="w-4 h-4 mr-1" />
                    <span>{comment.likes}</span>
                  </button>
                  {comment.replies && comment.replies.length > 0 && (
                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{comment.replies.length} trả lời</span>
                    </span>
                  )}
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    Trả lời
                  </button>
                </div>

                {/* Display replies if any */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex space-x-3">
                        <img
                          src={reply.user?.avatarUrl || "/placeholder-user.jpg"}
                          alt={
                            reply.user?.fullName ||
                            reply.user?.username ||
                            "Không xác định"
                          }
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {reply.user?.fullName ||
                                reply.user?.username ||
                                "Người dùng ẩn danh"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(reply.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {reply.content}
                          </p>
                          <div className="flex items-center space-x-3 text-xs mt-1">
                            <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <Heart className="w-3 h-3 mr-1" />
                              <span>{reply.likeCount || reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* No comments message */}
          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
