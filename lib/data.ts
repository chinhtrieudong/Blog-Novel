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

// Blog posts data will be loaded from storage
export const blogPosts: BlogPost[] = [];

// Comments data will be loaded from storage
export const comments: Comment[] = [];

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
