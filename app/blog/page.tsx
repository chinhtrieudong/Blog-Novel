import Link from "next/link";
import { Calendar, Eye, Tag, Search, Filter } from "lucide-react";

export default function BlogPage() {
  const categories = [
    "Tất cả",
    "Công nghệ",
    "Đời sống",
    "Du lịch",
    "Sách",
    "Phim ảnh",
    "Ẩm thực",
    "Sức khỏe",
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Những xu hướng công nghệ đáng chú ý năm 2024",
      excerpt:
        "Khám phá những công nghệ mới nổi và xu hướng phát triển trong năm 2024, từ AI generative, blockchain 3.0 đến metaverse và Web3. Cùng tìm hiểu cách những công nghệ này sẽ thay đổi cuộc sống của chúng ta.",
      category: "Công nghệ",
      date: "15 tháng 12, 2024",
      views: 2847,
      readTime: "8 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Nguyễn Văn A",
    },
    {
      id: 2,
      title: "Cách cân bằng cuộc sống và công việc hiệu quả",
      excerpt:
        "Những bí quyết giúp bạn duy trì sự cân bằng giữa công việc và cuộc sống cá nhân. Học cách quản lý thời gian, thiết lập ranh giới và tìm kiếm hạnh phúc trong từng khoảnh khắc.",
      category: "Đời sống",
      date: "12 tháng 12, 2024",
      views: 1923,
      readTime: "6 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Trần Thị B",
    },
    {
      id: 3,
      title: "Hành trình khám phá Sapa mùa đông",
      excerpt:
        "Chia sẻ trải nghiệm du lịch Sapa trong mùa đông với những cảnh đẹp tuyệt vời, văn hóa độc đáo của các dân tộc thiểu số và những món ăn đặc sản không thể bỏ qua.",
      category: "Du lịch",
      date: "10 tháng 12, 2024",
      views: 3156,
      readTime: "12 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Lê Văn C",
    },
    {
      id: 4,
      title: 'Review sách: "Atomic Habits" - Thói quen nguyên tử',
      excerpt:
        "Đánh giá chi tiết về cuốn sách nổi tiếng của James Clear và những bài học quý giá về cách xây dựng thói quen tích cực, loại bỏ thói quen xấu và thay đổi cuộc sống từng ngày một.",
      category: "Sách",
      date: "8 tháng 12, 2024",
      views: 1567,
      readTime: "10 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Phạm Thị D",
    },
    {
      id: 5,
      title: "Top 10 bộ phim hay nhất năm 2024",
      excerpt:
        "Danh sách những bộ phim đáng xem nhất trong năm với đánh giá chi tiết về cốt truyện, diễn xuất và kỹ xảo. Từ blockbuster Hollywood đến những tác phẩm indie độc đáo.",
      category: "Phim ảnh",
      date: "5 tháng 12, 2024",
      views: 4321,
      readTime: "15 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Hoàng Văn E",
    },
    {
      id: 6,
      title: "Hướng dẫn thiết lập workspace tại nhà hiệu quả",
      excerpt:
        "Những tips và tricks để tạo ra một không gian làm việc tại nhà thoải mái và hiệu quả. Từ việc chọn bàn ghế, ánh sáng đến cách trang trí để tăng năng suất làm việc.",
      category: "Đời sống",
      date: "3 tháng 12, 2024",
      views: 2892,
      readTime: "7 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Vũ Thị F",
    },
    {
      id: 7,
      title: "Khám phá ẩm thực đường phố Hà Nội",
      excerpt:
        "Hành trình khám phá những món ăn đường phố đặc trưng của Hà Nội, từ phở, bún chả đến những món ăn vặt độc đáo chỉ có ở thủ đô ngàn năm văn hiến.",
      category: "Ẩm thực",
      date: "1 tháng 12, 2024",
      views: 2156,
      readTime: "9 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Đỗ Văn G",
    },
    {
      id: 8,
      title: "Tự học lập trình: Lộ trình cho người mới bắt đầu",
      excerpt:
        "Hướng dẫn chi tiết về cách tự học lập trình từ con số 0, lựa chọn ngôn ngữ phù hợp, tài nguyên học tập và cách xây dựng portfolio để tìm việc làm.",
      category: "Công nghệ",
      date: "28 tháng 11, 2024",
      views: 3789,
      readTime: "20 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Ngô Thị H",
    },
    {
      id: 9,
      title: "Những bài tập yoga cơ bản cho người mới bắt đầu",
      excerpt:
        "Hướng dẫn chi tiết về các tư thế yoga cơ bản, lợi ích của từng động tác và cách thực hiện đúng kỹ thuật để tránh chấn thương và đạt hiệu quả tối đa.",
      category: "Sức khỏe",
      date: "25 tháng 11, 2024",
      views: 3421,
      readTime: "12 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Lý Thị I",
    },
    {
      id: 10,
      title: "Review iPhone 15 Pro Max: Có đáng mua không?",
      excerpt:
        "Đánh giá chi tiết về iPhone 15 Pro Max sau 2 tháng sử dụng. So sánh với các phiên bản trước và đưa ra lời khuyên về việc có nên nâng cấp hay không.",
      category: "Công nghệ",
      date: "22 tháng 11, 2024",
      views: 5678,
      readTime: "18 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Trần Văn K",
    },
    {
      id: 11,
      title: "Cách nấu phở bò Nam Định chuẩn vị",
      excerpt:
        "Công thức nấu phở bò Nam Định với nước dùng đậm đà, bánh phở dai ngon và các loại gia vị đặc trưng. Hướng dẫn từng bước chi tiết để có được tô phở hoàn hảo.",
      category: "Ẩm thực",
      date: "20 tháng 11, 2024",
      views: 2987,
      readTime: "25 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Nguyễn Thị L",
    },
    {
      id: 12,
      title: "Những cuốn sách hay nhất về đầu tư tài chính",
      excerpt:
        "Danh sách 10 cuốn sách về đầu tư và quản lý tài chính cá nhân hay nhất mọi thời đại. Từ những tác phẩm kinh điển đến những cuốn sách hiện đại phù hợp với thị trường Việt Nam.",
      category: "Sách",
      date: "18 tháng 11, 2024",
      views: 4123,
      readTime: "14 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Phạm Văn M",
    },
    {
      id: 13,
      title: "Hành trình khám phá Đà Lạt mùa hoa dã quỳ",
      excerpt:
        "Chia sẻ kinh nghiệm du lịch Đà Lạt vào mùa hoa dã quỳ nở rộ. Những địa điểm ngắm hoa đẹp nhất, thời gian lý tưởng và các tips để có những bức ảnh đẹp.",
      category: "Du lịch",
      date: "15 tháng 11, 2024",
      views: 3876,
      readTime: "11 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Lê Thị N",
    },
    {
      id: 14,
      title: "Cách thiết kế CV chuyên nghiệp để tăng cơ hội việc làm",
      excerpt:
        "Hướng dẫn chi tiết về cách thiết kế CV ấn tượng, các lỗi thường gặp cần tránh và những tips để CV của bạn nổi bật giữa hàng trăm ứng viên khác.",
      category: "Đời sống",
      date: "12 tháng 11, 2024",
      views: 5234,
      readTime: "16 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Hoàng Thị O",
    },
    {
      id: 15,
      title: "Review series 'Wednesday' trên Netflix",
      excerpt:
        "Đánh giá chi tiết về series 'Wednesday' với diễn xuất xuất sắc của Jenna Ortega. Phân tích cốt truyện, nhân vật và những điểm nhấn đáng chú ý của bộ phim.",
      category: "Phim ảnh",
      date: "10 tháng 11, 2024",
      views: 3456,
      readTime: "13 phút đọc",
      image: "/placeholder.svg?height=200&width=400",
      author: "Vũ Văn P",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Cá Nhân
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chia sẻ những suy nghĩ, trải nghiệm và kiến thức qua các bài viết
            chất lượng
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-5 h-5 mr-2" />
              Bộ lọc
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Tất cả"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <Tag className="w-3 h-3 mr-1" />
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{post.views.toLocaleString()} lượt xem</span>
                  </div>
                </div>

                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Đọc tiếp →
                </Link>
              </div>
            </article>
          ))}
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
                    ? "bg-blue-600 text-white"
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
  );
}
