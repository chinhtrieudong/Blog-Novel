import Link from "next/link"
import { BookOpen, PenTool, Users, Star, ArrowRight, Calendar, Eye } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Chào mừng đến với
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Blog & Novel
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Nơi chia sẻ những câu chuyện, suy nghĩ và những tác phẩm tiểu thuyết độc đáo. Khám phá thế giới văn chương
              qua góc nhìn cá nhân và những trải nghiệm thú vị.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PenTool className="w-5 h-5 mr-2" />
                Khám phá Blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/novels"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Đọc Tiểu thuyết
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trải nghiệm đọc và chia sẻ tuyệt vời với những tính năng độc đáo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Blog Cá Nhân</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chia sẻ những suy nghĩ, trải nghiệm và kiến thức qua các bài viết blog chất lượng cao
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tiểu Thuyết Nhiều Chương</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thưởng thức những tác phẩm tiểu thuyết dài tập với cốt truyện hấp dẫn và nhân vật sống động
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cộng Đồng Độc Giả</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kết nối với những người yêu thích văn chương và chia sẻ cảm nhận về các tác phẩm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Latest Blog Posts */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bài viết mới nhất</h2>
                <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    title: "Những xu hướng công nghệ đáng chú ý năm 2024",
                    excerpt: "Khám phá AI, blockchain, metaverse và những công nghệ đột phá đang thay đổi thế giới...",
                    date: "15 tháng 12, 2024",
                    views: 2847,
                    category: "Công nghệ",
                  },
                  {
                    id: 2,
                    title: "Cách cân bằng cuộc sống và công việc hiệu quả",
                    excerpt: "Những bí quyết giúp bạn duy trì sự cân bằng và tìm được hạnh phúc trong cuộc sống...",
                    date: "12 tháng 12, 2024",
                    views: 1923,
                    category: "Đời sống",
                  },
                  {
                    id: 3,
                    title: "Hành trình khám phá Sapa mùa đông",
                    excerpt: "Chia sẻ trải nghiệm du lịch Sapa với những cảnh đẹp tuyệt vời và văn hóa độc đáo...",
                    date: "10 tháng 12, 2024",
                    views: 3156,
                    category: "Du lịch",
                  },
                ].map((post) => (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{post.date}</span>
                      <Eye className="w-4 h-4 ml-4 mr-1" />
                      <span>{post.views.toLocaleString()} lượt xem</span>
                      <span className="ml-4 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      Đọc tiếp →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Novels */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tiểu thuyết mới nhất</h2>
                <Link href="/novels" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    title: "Hành Trình Đến Với Ánh Sáng",
                    excerpt: "Câu chuyện về chàng trai trẻ Minh khám phá thế giới ma thuật đầy bí ẩn...",
                    rating: 4.8,
                    reviews: 1256,
                    chapters: 45,
                    genre: "Fantasy",
                  },
                  {
                    id: 2,
                    title: "Tình Yêu Trong Mưa Thu",
                    excerpt: "Một câu chuyện tình lãng mạn diễn ra trong khung cảnh mùa thu thơ mộng...",
                    rating: 4.6,
                    reviews: 987,
                    chapters: 32,
                    genre: "Lãng mạn",
                  },
                  {
                    id: 3,
                    title: "Thám Tử Thành Phố",
                    excerpt: "Những vụ án bí ẩn được giải quyết bởi thám tử tài ba với trí thông minh phi thường...",
                    rating: 4.7,
                    reviews: 756,
                    chapters: 28,
                    genre: "Trinh thám",
                  },
                ].map((novel) => (
                  <div
                    key={novel.id}
                    className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        <span>
                          {novel.rating} ({novel.reviews} đánh giá)
                        </span>
                      </div>
                      <span className="text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                        {novel.genre}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{novel.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{novel.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{novel.chapters} chương</span>
                      <Link
                        href={`/novels/${novel.id}`}
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Đọc ngay →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Bắt đầu hành trình khám phá ngay hôm nay</h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký tài khoản để không bỏ lỡ những nội dung mới nhất và tham gia cộng đồng độc giả
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Đăng ký ngay
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
