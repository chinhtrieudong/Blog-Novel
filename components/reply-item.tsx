"use client";

import { Heart, Trash2 } from "lucide-react";
import { CommentResponse } from "@/types/api";

interface ReplyItemProps {
  reply: CommentResponse & { parentUser?: any };
  allComments: CommentResponse[];
  likesLoading: Set<number>;
  likedComments: Set<number>;
  adminActionLoading: Set<number>;
  replyingTo: number | null;
  replyContent: string;
  isSubmittingReply: boolean;
  onLike: (commentId: number) => void;
  onReplyClick: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onReplyContentChange: (value: string) => void;
  onCancelReply: () => void;
  onSubmitReply: (e: React.FormEvent) => void;
  canDeleteComment: (comment: CommentResponse) => boolean;
}

export default function ReplyItem({
  reply,
  allComments,
  likesLoading,
  likedComments,
  adminActionLoading,
  replyingTo,
  replyContent,
  isSubmittingReply,
  onLike,
  onReplyClick,
  onDelete,
  onReplyContentChange,
  onCancelReply,
  onSubmitReply,
  canDeleteComment,
}: ReplyItemProps) {
  return (
    <div className="flex space-x-3">
      <img
        src={reply.user?.avatarUrl || "/placeholder.svg"}
        alt={reply.user?.fullName || reply.user?.username || "Không xác định"}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {reply.user?.fullName ||
                reply.user?.username ||
                "Người dùng ẩn danh"}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {(reply as any).isNested && reply.parentUser ? (
              <>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  @
                  {reply.parentUser.fullName ||
                    reply.parentUser.username ||
                    "người dùng"}
                </span>{" "}
                {reply.content}
              </>
            ) : (
              reply.content
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-xs">
          <button
            onClick={() => onLike(reply.id)}
            disabled={likesLoading.has(reply.id)}
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart
              className={`w-3 h-3 mr-1 ${
                likesLoading.has(reply.id)
                  ? "animate-pulse"
                  : likedComments.has(reply.id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
            <span>{reply.likeCount || reply.likes}</span>
          </button>
          <button
            onClick={() => onReplyClick(reply.id)}
            className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
          >
            Trả lời
          </button>

          {/* Delete Button - Only show for reply author or admin */}
          {canDeleteComment(reply) && (
            <button
              onClick={() => onDelete(reply.id)}
              disabled={adminActionLoading.has(reply.id)}
              className="flex items-center space-x-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Xóa bình luận"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === reply.id && (
          <form onSubmit={onSubmitReply} className="mt-2 ml-10">
            <textarea
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              placeholder={`Trả lời ${
                reply.user?.fullName || reply.user?.username || "người dùng"
              }...`}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
              rows={2}
              required
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                type="button"
                onClick={onCancelReply}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmittingReply || !replyContent.trim()}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {isSubmittingReply ? "Đang gửi..." : "Trả lời"}
              </button>
            </div>
          </form>
        )}

        {/* Display nested replies */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-2 ml-6 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            {reply.replies
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((nestedReply) => (
                <ReplyItem
                  key={nestedReply.id}
                  reply={{ ...nestedReply, parentUser: reply.user }}
                  allComments={allComments}
                  likesLoading={likesLoading}
                  likedComments={likedComments}
                  adminActionLoading={adminActionLoading}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  isSubmittingReply={isSubmittingReply}
                  onLike={onLike}
                  onReplyClick={onReplyClick}
                  onDelete={onDelete}
                  onReplyContentChange={onReplyContentChange}
                  onCancelReply={onCancelReply}
                  onSubmitReply={onSubmitReply}
                  canDeleteComment={canDeleteComment}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
