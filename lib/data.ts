export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  views: number;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  relatedPosts: number[];
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

// Sample blog posts data (shorter version for testing)
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Những xu hướng công nghệ đáng chú ý năm 2024",
    content: `<p class="mb-6">Năm 2024 đánh dấu một bước ngoặt quan trọng trong lĩnh vực công nghệ với sự xuất hiện của nhiều xu hướng mới và đột phá. Từ trí tuệ nhân tạo đến blockchain, các công nghệ này đang định hình lại cách chúng ta sống và làm việc.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">1. AI Generative và Machine Learning</h2>

<p class="mb-6">AI Generative đã vượt xa khỏi việc chỉ tạo ra hình ảnh và văn bản. Các mô hình như GPT-4, DALL-E 3 đang được tích hợp vào nhiều ứng dụng thực tế, từ thiết kế đồ họa đến sáng tạo nội dung marketing.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">2. Blockchain và Web3</h2>

<p class="mb-6">Công nghệ blockchain không chỉ dừng lại ở tiền điện tử mà còn mở rộng sang các lĩnh vực như quản lý chuỗi cung ứng, xác thực danh tính số và tài chính phi tập trung (DeFi).</p>

<h2 class="text-2xl font-bold mb-4 mt-8">3. Metaverse và Thực tế ảo</h2>

<p class="mb-6">Metaverse đang trở thành hiện thực với các nền tảng như Roblox, Decentraland. Các doanh nghiệp đang đầu tư mạnh mẽ vào việc xây dựng trải nghiệm ảo cho khách hàng.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">4. Internet of Things (IoT) và Smart Cities</h2>

<p class="mb-6">IoT đang kết nối hàng tỷ thiết bị, tạo nên những thành phố thông minh với hệ thống giao thông, năng lượng và an ninh được tối ưu hóa bằng dữ liệu thời gian thực.</p>

<p class="mb-6">Những xu hướng này không chỉ mang tính chất công nghệ mà còn tạo ra những cơ hội kinh doanh mới và thay đổi cách chúng ta tương tác với thế giới xung quanh. Việc nắm bắt và áp dụng các xu hướng này sẽ giúp doanh nghiệp và cá nhân duy trì lợi thế cạnh tranh trong thời đại số.</p>`,
    excerpt:
      "Khám phá những công nghệ mới nổi và xu hướng phát triển trong năm 2024.",
    category: "Công nghệ",
    date: "15 tháng 12, 2024",
    views: 2847,
    readTime: "8 phút đọc",
    image: "/placeholder.svg?height=400&width=800",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder-user.jpg",
      bio: "Chuyên gia công nghệ với 10 năm kinh nghiệm.",
    },
    tags: ["AI", "Blockchain", "Metaverse", "Công nghệ"],
    relatedPosts: [2, 8, 5],
  },
  {
    id: 2,
    title: "Cách cân bằng cuộc sống và công việc hiệu quả",
    content: `<p class="mb-6">Trong thời đại hiện nay, việc cân bằng giữa công việc và cuộc sống cá nhân trở thành một thách thức lớn đối với nhiều người. Áp lực từ công việc, deadline liên tục, và sự phát triển nhanh chóng của công nghệ khiến chúng ta dễ dàng bị cuốn vào vòng xoáy công việc mà quên mất việc chăm sóc bản thân và gia đình.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">1. Xác định rõ ràng ranh giới giữa công việc và cuộc sống</h2>

<p class="mb-6">Điều đầu tiên và quan trọng nhất là bạn cần thiết lập ranh giới rõ ràng giữa thời gian làm việc và thời gian cá nhân. Hãy thử áp dụng quy tắc "không làm việc sau 7 giờ tối" hoặc "không kiểm tra email vào cuối tuần".</p>

<h2 class="text-2xl font-bold mb-4 mt-8">2. Lập kế hoạch và ưu tiên công việc</h2>

<p class="mb-6">Hãy sử dụng các công cụ quản lý thời gian như Todoist, Trello hoặc Google Calendar để lập kế hoạch công việc một cách có hệ thống. Điều này giúp bạn hoàn thành công việc hiệu quả hơn trong giờ làm việc.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">3. Chăm sóc sức khỏe thể chất và tinh thần</h2>

<p class="mb-6">Đừng quên dành thời gian cho việc tập thể dục, thiền định, hoặc đơn giản là đi dạo trong công viên. Sức khỏe tinh thần cũng quan trọng không kém - hãy dành thời gian cho sở thích cá nhân và gặp gỡ bạn bè.</p>

<h2 class="text-2xl font-bold mb-4 mt-8">4. Giao tiếp hiệu quả với đồng nghiệp và cấp trên</h2>

<p class="mb-6">Học cách nói "không" với những công việc không cần thiết và giao tiếp rõ ràng về khả năng và giới hạn của bản thân. Điều này giúp bạn tránh bị quá tải công việc.</p>

<p class="mb-6">Việc cân bằng cuộc sống và công việc không phải là điều dễ dàng, nhưng với sự kiên trì và áp dụng đúng phương pháp, bạn hoàn toàn có thể đạt được sự cân bằng này. Hãy bắt đầu từ những thay đổi nhỏ và dần dần xây dựng thói quen lành mạnh cho bản thân.</p>`,
    excerpt:
      "Những bí quyết giúp bạn duy trì sự cân bằng giữa công việc và cuộc sống cá nhân.",
    category: "Đời sống",
    date: "12 tháng 12, 2024",
    views: 1923,
    readTime: "6 phút đọc",
    image: "/placeholder.svg?height=400&width=800",
    author: {
      name: "Trần Thị B",
      avatar: "/placeholder-user.jpg",
      bio: "Chuyên gia tư vấn cuộc sống và phát triển cá nhân.",
    },
    tags: ["Cuộc sống", "Công việc", "Sức khỏe", "Quản lý thời gian"],
    relatedPosts: [6, 3, 7],
  },
];

export const comments: Comment[] = [
  {
    id: 1,
    author: "Nguyễn Văn X",
    avatar: "/placeholder-user.jpg",
    content: "Bài viết rất hay và hữu ích! Cảm ơn tác giả đã chia sẻ.",
    date: "2 giờ trước",
    likes: 5,
  },
  {
    id: 2,
    author: "Trần Thị Y",
    avatar: "/placeholder-user.jpg",
    content: "Tôi đã áp dụng những tips này và thấy hiệu quả rõ rệt.",
    date: "5 giờ trước",
    likes: 3,
  },
];

export const categories = [
  "Tất cả",
  "Công nghệ",
  "Đời sống",
  "Du lịch",
  "Sách",
  "Phim ảnh",
  "Ẩm thực",
  "Sức khỏe",
];

// Helper functions
export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

export function getRelatedPosts(postId: number): BlogPost[] {
  const post = getBlogPostById(postId);
  if (!post) return [];

  return blogPosts.filter((p) => post.relatedPosts.includes(p.id));
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "Tất cả") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
}

export function searchPosts(query: string): BlogPost[] {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
