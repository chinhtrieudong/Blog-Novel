export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  status: "draft" | "published" | "pending";
  category: string;
  tags?: string[];
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  status: "draft" | "published" | "pending";
  category: string;
  tags?: string[];
}
