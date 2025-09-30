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
import { getNovelById, getChaptersByNovelId } from "@/lib/novel-data";

export default async function NovelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const novel = getNovelById(parseInt((await params).id));

  if (!novel) {
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

  const chapters = getChaptersByNovelId(novel.id);

  const comments = [
    {
      id: 1,
      user: "Độc giả cuồng nhiệt",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Truyện hay quá! Cốt truyện hấp dẫn và nhân vật được xây dựng rất tốt. Đặc biệt là cách tác giả miêu tả thế giới ma thuật rất sinh động. Mong tác giả cập nhật thêm nhiều chương.",
      time: "2 giờ trước",
      likes: 25,
      replies: 3,
    },
    {
      id: 2,
      user: "Fan Fantasy",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Chương mới nhất quá xuất sắc! Không thể chờ đợi để xem Minh sẽ phát triển như thế nào trong chương tiếp theo. Hy vọng sẽ có thêm nhiều màn chiến đấu epic.",
      time: "5 giờ trước",
      likes: 18,
      replies: 1,
    },
    {
      id: 3,
      user: "Người đọc thầm lặng",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Tác phẩm này thực sự đáng đọc. Tôi đã theo dõi từ chương đầu và không hề thất vọng. Cảm ơn tác giả đã mang đến những giờ phút giải trí tuyệt vời.",
      time: "1 ngày trước",
      likes: 32,
      replies: 5,
    },
    {
      id: 4,
      user: "Phê bình gia",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Văn phong của tác giả rất cuốn hút, cách xây dựng nhân vật có chiều sâu. Tuy nhiên, tôi mong muốn thấy thêm sự phát triển của các nhân vật phụ.",
      time: "2 ngày trước",
      likes: 14,
      replies: 2,
    },
    {
      id: 5,
      user: "Yêu thích ma thuật",
      avatar: "/placeholder.svg?height=40&width=40",
      comment:
        "Hệ thống ma thuật trong truyện được thiết kế rất logic và thú vị. Mỗi loại phép thuật đều có quy tắc riêng, không bị lộn xộn như nhiều truyện khác.",
      time: "3 ngày trước",
      likes: 21,
      replies: 4,
    },
  ];

  return (
    <div className="min-h-screen py-8">
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
                    src={novel.cover || "/placeholder.svg"}
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
                      {novel.author}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {novel.rating}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        ({novel.reviews} đánh giá)
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-5 h-5 mr-1" />
                      <span>{novel.chapters} chương</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="w-5 h-5 mr-1" />
                      <span>{novel.views.toLocaleString()} lượt đọc</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Heart className="w-5 h-5 mr-1" />
                      <span>{novel.likes.toLocaleString()} yêu thích</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        novel.status === "Hoàn thành"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {novel.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {novel.genre}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cập nhật: {novel.lastUpdate}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {novel.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                      >
                        #{tag}
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
                  Danh sách chương ({novel.chapters})
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
                        <span>{chapter.publishDate}</span>
                        <Eye className="w-4 h-4 ml-4 mr-1" />
                        <span>{chapter.views} lượt đọc</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Bình luận ({comments.length})
                </h2>
              </div>

              {/* Comment Form */}
              <div className="mb-6">
                <textarea
                  placeholder="Viết bình luận của bạn..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Gửi bình luận
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Thông tin tác giả
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/placeholder.svg?height=60&width=60"
                  alt="Tác giả"
                  className="w-15 h-15 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {novel.author}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tác giả
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Tác giả với nhiều năm kinh nghiệm viết truyện, chuyên về thể
                loại fantasy và phiêu lưu.
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
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    href={`/novels/${i + 10}`}
                    className="flex space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={`/placeholder.svg?height=60&width=45&query=related novel ${i}`}
                      alt={`Truyện liên quan ${i}`}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                        Tên truyện liên quan số {i}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        <span>4.{i + 5}</span>
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
