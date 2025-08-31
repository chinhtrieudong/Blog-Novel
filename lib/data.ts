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
    content: `<p class="mb-6">Năm 2024 đánh dấu một bước ngoặt quan trọng trong lĩnh vực công nghệ với sự xuất hiện của nhiều xu hướng mới và đột phá.</p><h2 class="text-2xl font-bold mb-4">1. AI Generative</h2><p class="mb-6">AI Generative đã vượt xa khỏi việc chỉ tạo ra hình ảnh và văn bản.</p>`,
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
    content: `<p class="mb-6">Trong thời đại hiện nay, việc cân bằng giữa công việc và cuộc sống cá nhân trở thành một thách thức lớn.</p>`,
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
