import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  Settings,
  Type,
  Moon,
  Sun,
} from "lucide-react";
import {
  getNovelById,
  getChapterById,
  getNextChapter,
  getPrevChapter,
  chapterComments,
} from "@/lib/novel-data";

export default function ChapterDetailPage({
  params,
}: {
  params: { id: string; chapterId: string };
}) {
  const novel = getNovelById(parseInt(params.id));
  const chapter = getChapterById(
    parseInt(params.chapterId),
    parseInt(params.id)
  );

  if (!novel || !chapter) {
    notFound();
  }

  const prevChapter = getPrevChapter(
    parseInt(params.chapterId),
    parseInt(params.id)
  );
  const nextChapter = getNextChapter(
    parseInt(params.chapterId),
    parseInt(params.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/novels/${novel.id}`}
                className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {novel.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chapter.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Type className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Moon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          {/* Chapter Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {chapter.title}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{chapter.publishDate}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>{chapter.views} lượt đọc</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{chapter.wordCount} từ</span>
              </div>
            </div>
          </div>

          {/* Chapter Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />

          {/* Chapter Actions */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                <Heart className="w-5 h-5" />
                <span>{chapter.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400">
                <MessageCircle className="w-5 h-5" />
                <span>{chapter.comments}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          {prevChapter ? (
            <Link
              href={`/novels/${novel.id}/chapter/${prevChapter.id}`}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Chương trước</span>
            </Link>
          ) : (
            <div></div>
          )}

          <Link
            href={`/novels/${novel.id}`}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Danh sách chương
          </Link>

          {nextChapter ? (
            <Link
              href={`/novels/${novel.id}/chapter/${nextChapter.id}`}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span>Chương tiếp</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <div></div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Bình luận ({chapterComments.length})
          </h3>

          {/* Comment Form */}
          <div className="mb-6">
            <textarea
              placeholder="Viết bình luận của bạn..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={4}
            />
            <div className="flex justify-end mt-2">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Gửi bình luận
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {chapterComments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <img
                  src={comment.avatar}
                  alt={comment.user}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {comment.user}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment.comment}
                    </p>
                  </div>
                  <div className="flex items-center mt-2 space-x-4">
                    <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                      <Heart className="w-4 h-4 mr-1" />
                      {comment.likes}
                    </button>
                    <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
