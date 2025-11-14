import Link from "next/link";
import {
  Star,
  BookOpen,
  Users,
  Heart,
  Share2,
  MessageCircle,
  ChevronRight,
  Calendar,
  Eye,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import Comments from "@/components/comments";

export default async function NovelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const novelId = parseInt((await params).id);

  // Increment novel views (silence errors)
  try {
    await apiClient.incrementNovelViews(novelId);
  } catch (error) {
    // Silently fail view increment - not critical
    console.log("Could not increment novel views:", error);
  }

  const novelResponse = await apiClient.getNovelById(novelId);

  if (!novelResponse.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy tiểu thuyết
          </h1>
          <Link
            href="/novels"
            className="text-purple-600 dark:text-purple-400 hover:underline"
          >
            Quay lại danh sách tiểu thuyết
          </Link>
        </div>
      </div>
    );
  }

  const novel = novelResponse.data;
  const chaptersResponse = await apiClient.getChapters(novelId);
  const chapters = chaptersResponse.data || [];

  const commentsResponse = await apiClient.getNovelComments(novelId);
  const comments = commentsResponse.data || [];

  const relatedResponse = await apiClient.getRelatedNovels(novelId);
  const relatedNovels = Array.isArray(relatedResponse.data)
    ? relatedResponse.data
    : [];

  return (
    <div className="min-h-screen py-8" data-page-type="novel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link
            href="/novels"
            className="hover:text-purple-600 dark:hover:text-purple-400"
          >
            Tiểu thuyết
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{novel.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Novel Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 h-80 flex-shrink-0">
                  <img
                    src={novel.coverImage || "/placeholder.svg"}
                    alt={novel.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {novel.title}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Tác giả:{" "}
                    <span className="text-gray-900 dark:text-white font-medium">
                      {novel.author.name}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {novel.avgRating}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        (đánh giá)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-5 h-5 mr-1" />
                      <span>{novel.totalChapters} chương</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5 mr-1" />
                      <span>
                        {novel.totalViews?.toLocaleString() || "0"} lượt đọc
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Heart className="w-5 h-5 mr-1" />
                      <span>
                        {novel.totalLikes?.toLocaleString() || "0"} yêu thích
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        novel.status === "COMPLETED"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {novel.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {novel.genres[0]?.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cập nhật: {novel.lastChapterUpdate}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {novel.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        #{genre.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/novels/${novel.id}/chapter/1`}
                      className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium"
                    >
                      Đọc từ đầu
                    </Link>
                    <Link
                      href={`/novels/${novel.id}/chapter/${chapters.length}`}
                      className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center font-medium"
                    >
                      Chương mới nhất
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Tóm tắt
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {novel.description}
              </p>
            </div>

            {/* Chapters List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Danh sách chương ({novel.totalChapters})
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
                    Mới nhất
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    Cũ nhất
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/novels/${novel.id}/chapter/${chapter.id}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{chapter.createdAt}</span>
                        <Eye className="w-4 h-4 ml-4 mr-1" />
                        <span>{chapter.viewCount} lượt đọc</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                  </Link>
                ))}
              </div>

              <div className="flex justify-center mt-6">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Xem thêm chương
                </button>
              </div>
            </div>

            {/* Comments */}
            <Comments novelId={novelId} initialComments={comments} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Thông tin tác giả
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={novel.author.avatarUrl || "/placeholder.svg"}
                  alt={novel.author.name}
                  className="w-15 h-15 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {novel.author.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tác giả
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {novel.author.bio}
              </p>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Theo dõi tác giả
              </button>
            </div>

            {/* Related Novels */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Truyện liên quan
              </h3>
              <div className="space-y-4">
                {relatedNovels.map((relatedNovel) => (
                  <Link
                    key={relatedNovel.id}
                    href={`/novels/${relatedNovel.id}`}
                    className="flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={relatedNovel.coverImage || "/placeholder.svg"}
                      alt={relatedNovel.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        {relatedNovel.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        <span>{relatedNovel.avgRating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
