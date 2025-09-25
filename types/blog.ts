// Re-export API types for backward compatibility
export type {
  PostResponse as Post,
  CategoryResponse as Category,
  TagResponse as Tag,
  PostRequest as CreatePostInput,
} from "./api";

// Legacy interfaces for backward compatibility
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
