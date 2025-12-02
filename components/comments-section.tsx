"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  MessageCircle,
  ChevronDown,
  Heart,
  Trash2,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { CommentResponse } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import ReplyItem from "@/components/reply-item";

interface CommentsSectionProps {
  postId: number;
  contentType?: "post" | "novel" | "chapter";
  chapterId?: number; // for chapter comments
  initialComments: CommentResponse[];
}

type SortOption = "oldest" | "newest" | "most_liked";

export default function CommentsSection({
  postId,
  contentType = "post",
  chapterId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentResponse[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likesLoading, setLikesLoading] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState<Set<number>>(
    new Set()
  );
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
    { value: "most_liked", label: "Nhiều like nhất" },
  ];

  // Build flattened structure - only 2 levels: root comments and their replies (all nested replies flattened)
  const buildCommentHierarchy = (
    flatComments: CommentResponse[]
  ): CommentResponse[] => {
    const commentMap = new Map<number, CommentResponse>();
    const rootComments: CommentResponse[] = [];

    // First pass: create map of all comments
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build hierarchy with only 2 levels
    flatComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;

      if (comment.parentId === null) {
        // Root comment - collect ALL its replies (direct and nested)
        rootComments.push(commentWithReplies);
      } else if (comment.parentId !== undefined && comment.parentId !== null) {
        // Find the root parent for this reply
        let rootParentId: number = comment.parentId;
        let currentComment = commentMap.get(rootParentId);
        let isNested = false;

        // Traverse up to find the root comment
        while (
          currentComment &&
          currentComment.parentId !== null &&
          currentComment.parentId !== undefined
        ) {
          rootParentId = currentComment.parentId;
          currentComment = commentMap.get(rootParentId);
          isNested = true; // If we traversed up, this is a nested reply
        }

        // Add this reply to the root comment's replies (flattened)
        const rootParent = commentMap.get(rootParentId);
        if (rootParent) {
          rootParent.replies = rootParent.replies || [];
          rootParent.replies.push({ ...commentWithReplies, isNested } as any);
        }
      }
    });

    return rootComments;
  };

  const loadComments = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      let response;
      if (contentType === "chapter") {
        response = await apiClient.getChapterComments(
          postId,
          chapterId!,
          sortBy
        );
      } else if (contentType === "novel") {
        response = await apiClient.getNovelComments(postId, sortBy);
      } else {
        response = await apiClient.getPostComments(postId, sortBy);
      }
      const flatComments = response.data || [];
      const nestedComments = buildCommentHierarchy(flatComments);
      setComments(nestedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      setError("Không thể tải bình luận.");
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setIsSortMenuOpen(false);
  };

  // Reload comments when sort changes
  useEffect(() => {
    loadComments();
  }, [sortBy]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để bình luận.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      let response;
      if (contentType === "chapter") {
        response = await apiClient.createChapterComment(postId, chapterId!, {
          content: newComment.trim(),
        });
      } else if (contentType === "novel") {
        response = await apiClient.createNovelComment(postId, {
          content: newComment.trim(),
        });
      } else {
        response = await apiClient.createPostComment(postId, {
          content: newComment.trim(),
        });
      }

      if (response.data) {
        // Reload comments to maintain sorting order
        await loadComments();
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi bình luận. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để thích bình luận.",
        variant: "destructive",
      });
      return;
    }

    if (likesLoading.has(commentId)) return;

    setLikesLoading((prev) => new Set([...prev, commentId]));

    try {
      await apiClient.likeComment(commentId);

      // Add to liked comments set and reload comments
      setLikedComments((prev) => new Set([...prev, commentId]));
      await loadComments(true);

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

  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để xóa bình luận.",
        variant: "destructive",
      });
      return;
    }

    if (adminActionLoading.has(commentId)) return;

    setAdminActionLoading((prev) => new Set([...prev, commentId]));

    try {
      await apiClient.deleteComment(commentId);
      await loadComments(true);

      toast({
        title: "Thành công",
        description: "Đã xóa bình luận!",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setAdminActionLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  // Find parent comment for a reply (for Facebook-like display)
  const findParentComment = (
    comments: CommentResponse[],
    replyId: number
  ): CommentResponse | null => {
    for (const comment of comments) {
      if (comment.replies?.some((reply) => reply.id === replyId)) {
        return comment;
      }
    }
    return null;
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Lỗi",
        description: "Bạn cần đăng nhập để trả lời bình luận.",
        variant: "destructive",
      });
      return;
    }

    if (!replyContent.trim() || !replyingTo) return;

    setIsSubmittingReply(true);

    try {
      let response;
      if (contentType === "chapter") {
        response = await apiClient.createChapterComment(postId, chapterId!, {
          content: replyContent.trim(),
          parentId: replyingTo,
        });
      } else if (contentType === "novel") {
        response = await apiClient.createNovelComment(postId, {
          content: replyContent.trim(),
          parentId: replyingTo,
        });
      } else {
        response = await apiClient.createPostComment(postId, {
          content: replyContent.trim(),
          parentId: replyingTo,
        });
      }

      if (response.data) {
        // Reload comments to show new reply
        await loadComments();
        setReplyingTo(null);
        setReplyContent("");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi trả lời. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const canDeleteComment = (comment: CommentResponse) => {
    // User can delete if they are the author or an admin
    return user?.id === comment.user?.id || isAdmin;
  };

  return (
    <section className="mb-12">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Bình luận ({comments.length})
          </h2>

          {/* Sort Options */}
          <div className="relative">
            <button
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <span className="text-gray-700 dark:text-gray-300">
                {sortOptions.find((option) => option.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-gray-500 transition-transform ${
                  isSortMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSortMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === option.value
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={likesLoading.has(comment.id)}
                      className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {comment.replies && comment.replies.length > 0 && (
                      <span className="flex items-center text-gray-500 dark:text-gray-400">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{comment.replies.length} trả lời</span>
                      </span>
                    )}
                    <button
                      onClick={() => handleReplyClick(comment.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      Trả lời
                    </button>

                    {/* Delete Button - Only show for comment author or admin */}
                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={adminActionLoading.has(comment.id)}
                        className="flex items-center space-x-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa bình luận"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <form onSubmit={handleSubmitReply} className="mt-3 ml-12">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Trả lời ${
                          comment.user?.fullName ||
                          comment.user?.username ||
                          "người dùng"
                        }...`}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={2}
                        required
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          type="button"
                          onClick={handleCancelReply}
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReply || !replyContent.trim()}
                          className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isSubmittingReply ? "Đang gửi..." : "Trả lời"}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Display replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      {/* Sort replies by creation time */}
                      {comment.replies
                        .sort(
                          (a, b) =>
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        )
                        .map((reply) => (
                          <ReplyItem
                            key={reply.id}
                            reply={{ ...reply, parentUser: comment.user }}
                            allComments={comments}
                            likesLoading={likesLoading}
                            likedComments={likedComments}
                            adminActionLoading={adminActionLoading}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            isSubmittingReply={isSubmittingReply}
                            onLike={handleLikeComment}
                            onReplyClick={handleReplyClick}
                            onDelete={handleDeleteComment}
                            onReplyContentChange={setReplyContent}
                            onCancelReply={handleCancelReply}
                            onSubmitReply={handleSubmitReply}
                            canDeleteComment={canDeleteComment}
                          />
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
      </div>
    </section>
  );
}
