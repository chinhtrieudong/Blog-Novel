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
import AuthorFollowButton from "@/components/author-follow-button";
import NovelSidebar from "@/components/novel-sidebar";
import FavoriteDisplay from "@/components/favorite-display";
import SaveButton from "@/components/save-button";
import NovelShareButton from "@/components/novel-share-button";
import StarRating from "@/components/star-rating";

export default async function NovelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const novelId = parseInt((await params).id);

  await apiClient.incrementNovelViews(novelId);

  const novelResponse = await apiClient.getNovelById(novelId);
  console.log(novelResponse.data);

  // Handle authentication errors
  if (novelResponse.code === 401) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Phải đăng nhập để xem tiểu thuyết
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Bạn cần đăng nhập tài khoản để có thể đọc tiểu thuyết.
          </p>
          <Link
            href="/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

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

  // Handle chapters with error fallback
  let chapters: any[] = [];
  try {
    const chaptersResponse = await apiClient.getChapters(novelId);
    chapters = chaptersResponse.data || [];
  } catch (error) {
    console.error("Failed to load chapters:", error);
    chapters = [];
  }

  // Handle comments with error fallback
  let comments: any[] = [];
  try {
    const commentsResponse = await apiClient.getNovelComments(novelId);
    comments = commentsResponse.data || [];
  } catch (error) {
    console.error("Failed to load comments:", error);
    comments = [];
  }

  // Handle related novels with error fallback
  let relatedNovels: any[] = [];
  try {
    const relatedResponse = await apiClient.getRelatedNovels(novelId);
    relatedNovels = Array.isArray(relatedResponse.data)
      ? relatedResponse.data
      : [];
  } catch (error) {
    console.error("Failed to load related novels:", error);
    relatedNovels = [];
  }

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
                    src={novel.coverImage || "/default-img.png"}
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
                      <NovelShareButton
                        novelId={novel.id}
                        title={novel.title}
                        description={novel.description}
                      />
                      <SaveButton
                        novelId={novel.id}
                        novelTitle={novel.title}
                        size="lg"
                      />
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
                      <span className="text-gray-600 dark:text-gray-400 mr-2">
                        Đánh giá:
                      </span>
                      <StarRating
                        novelId={novel.id}
                        initialRating={novel.avgRating || 0}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-5 h-5 mr-1" />
                      <span>{novel.totalChapters} chương</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5 mr-1" />
                      <span>
                        {novel.viewCount?.toLocaleString() || "0"} lượt đọc
                      </span>
                    </div>
                    <FavoriteDisplay novel={novel} />
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
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Cập nhật:{" "}
                      {novel.lastChapterUpdate || novel.updatedAt
                        ? new Date(
                            novel.lastChapterUpdate || novel.updatedAt
                          ).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {novel.genres.map((genre: any) => (
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

          <NovelSidebar
            novel={{
              ...novel,
              author: {
                ...novel.author,
                bio: novel.author.bio || "",
              },
            }}
            relatedNovels={relatedNovels}
          />
        </div>
      </div>
    </div>
  );
}
