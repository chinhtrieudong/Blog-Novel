import Link from "next/link"
import { Star, BookOpen, Users, Search, Filter, TrendingUp } from "lucide-react"

export default function NovelsPage() {
  const genres = ["Tất cả", "Lãng mạn", "Hành động", "Trinh thám", "Khoa học viễn tưởng", "Fantasy", "Kinh dị"]
  const sortOptions = ["Mới nhất", "Phổ biến", "Đánh giá cao", "Hoàn thành"]

  const stats = {
    totalNovels: 156,
    completedNovels: 23,
    ongoingNovels: 133,
    totalViews: 1200000,
  }

  const novels = [
    {
      id: 1,
      title: "Hành Trình Đến Với Ánh Sáng",
      author: "Nguyễn Minh Tâm",
      description:
        "Câu chuyện về một chàng trai trẻ tên Minh khám phá thế giới ma thuật đầy bí ẩn. Từ một người bình thường, anh dần khám phá ra những sức mạnh tiềm ẩn trong mình và bắt đầu hành trình tìm kiếm ánh sáng để cứu rỗi thế giới khỏi bóng tối.",
      genre: "Fantasy",
      chapters: 45,
      status: "Đang cập nhật",
      rating: 4.8,
      reviews: 1256,
      views: 25420,
      lastUpdate: "2 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 2,
      title: "Tình Yêu Trong Mưa Thu",
      author: "Lê Hương Giang",
      description:
        "Một câu chuyện tình lãng mạn diễn ra trong khung cảnh mùa thu thơ mộng với những cung bậc cảm xúc sâu lắng. Hai trái tim tìm thấy nhau giữa những giọt mưa thu và lá vàng rơi.",
      genre: "Lãng mạn",
      chapters: 32,
      status: "Hoàn thành",
      rating: 4.6,
      reviews: 987,
      views: 18350,
      lastUpdate: "1 ngày trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 3,
      title: "Thám Tử Thành Phố",
      author: "Trần Đức Minh",
      description:
        "Những vụ án bí ẩn trong thành phố lớn được giải quyết bởi một thám tử tài ba với trí thông minh phi thường. Mỗi vụ án là một câu đố logic đầy thử thách.",
      genre: "Trinh thám",
      chapters: 28,
      status: "Đang cập nhật",
      rating: 4.7,
      reviews: 756,
      views: 15876,
      lastUpdate: "5 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 4,
      title: "Chiến Binh Không Gian",
      author: "Phạm Quang Huy",
      description:
        "Cuộc chiến giữa các hành tinh trong tương lai xa với công nghệ tiên tiến và những trận đánh hoành tráng. Nhân loại phải đối mặt với những thử thách sinh tồn trong vũ trụ bao la.",
      genre: "Khoa học viễn tưởng",
      chapters: 67,
      status: "Đang cập nhật",
      rating: 4.9,
      reviews: 2156,
      views: 34560,
      lastUpdate: "1 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 5,
      title: "Bóng Đêm Kinh Hoàng",
      author: "Vũ Thị Mai",
      description:
        "Những câu chuyện kinh dị đan xen trong đêm tối với những bí ẩn không thể giải thích được. Sự thật đáng sợ ẩn giấu sau những hiện tượng siêu nhiên.",
      genre: "Kinh dị",
      chapters: 23,
      status: "Đang cập nhật",
      rating: 4.4,
      reviews: 543,
      views: 12890,
      lastUpdate: "3 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 6,
      title: "Võ Lâm Truyền Kỳ",
      author: "Hoàng Văn Long",
      description:
        "Thế giới võ lâm với những cao thủ tuyệt đỉnh và những cuộc tranh đấu gay cấn để tranh giành bí kíp. Nghĩa khí giang hồ và tình bạn thủy chung trong thế giới kiếm hiệp.",
      genre: "Hành động",
      chapters: 89,
      status: "Hoàn thành",
      rating: 4.5,
      reviews: 1876,
      views: 45670,
      lastUpdate: "1 tuần trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 7,
      title: "Học Viện Ma Pháp",
      author: "Đỗ Minh Châu",
      description:
        "Cuộc sống tại học viện ma pháp danh tiếng với những bài học thú vị và những cuộc phiêu lưu đầy nguy hiểm. Tình bạn và sự trưởng thành của những pháp sư trẻ tuổi.",
      genre: "Fantasy",
      chapters: 56,
      status: "Đang cập nhật",
      rating: 4.7,
      reviews: 1432,
      views: 28900,
      lastUpdate: "4 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
    {
      id: 8,
      title: "Công Chúa Băng Giá",
      author: "Lý Thanh Hương",
      description:
        "Câu chuyện về một công chúa với sức mạnh băng giá cố gắng tìm lại vương quốc đã mất. Hành trình đầy gian khó để khôi phục hòa bình cho đất nước.",
      genre: "Fantasy",
      chapters: 41,
      status: "Đang cập nhật",
      rating: 4.6,
      reviews: 1098,
      views: 22340,
      lastUpdate: "6 giờ trước",
      cover: "/placeholder.svg?height=300&width=200",
    },
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Thư Viện Tiểu Thuyết</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Khám phá những tác phẩm tiểu thuyết hấp dẫn với nhiều thể loại đa dạng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalNovels}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng tiểu thuyết</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedNovels}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.ongoingNovels}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Đang cập nhật</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {(stats.totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Lượt đọc</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tiểu thuyết..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc
            </button>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  genre === "Tất cả"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Novels Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels.map((novel) => (
            <div
              key={novel.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="flex">
                <div className="w-32 h-48 flex-shrink-0">
                  <img
                    src={novel.cover || "/placeholder.svg"}
                    alt={novel.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        novel.status === "Hoàn thành"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {novel.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{novel.lastUpdate}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {novel.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{novel.author}</p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{novel.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                      {novel.genre}
                    </span>
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{novel.chapters} chương</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      <span>
                        {novel.rating} ({novel.reviews})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{novel.views.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link
                    href={`/novels/${novel.id}`}
                    className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline font-medium text-sm"
                  >
                    Đọc ngay →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trending Section */}
        <div className="mt-16">
          <div className="flex items-center mb-8">
            <TrendingUp className="w-6 h-6 text-orange-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Xu hướng tuần này</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {novels.slice(0, 4).map((novel, index) => (
              <div key={novel.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-orange-500"
                            : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{novel.title}</h4>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="w-3 h-3 mr-1 text-yellow-400" />
                      <span>{novel.rating}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/novels/${novel.id}`}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Trước
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-lg ${
                  page === 1
                    ? "bg-purple-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
              Sau
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
