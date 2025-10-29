import { promises as fs } from "fs";
import path from "path";

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  coverImageUrl: string;
  status: string;
  author: {
    id: number;
    username: string;
    email: string;
    fullName: string | null;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

class DataStorage {
  private posts: Post[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing posts
      try {
        const data = await fs.readFile(POSTS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.posts = parsed.posts || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, start with empty array
        this.posts = [];
        this.nextId = 1;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
      this.posts = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        posts: this.posts,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(POSTS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving to file:", error);
    }
  }

  async getAllPosts(): Promise<Post[]> {
    return [...this.posts];
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.posts.find((post) => post.id === id) || null;
  }

  async createPost(
    postData: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<Post> {
    const now = new Date().toISOString();
    const newPost: Post = {
      ...postData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.posts.unshift(newPost);
    await this.saveToFile();

    return newPost;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | null> {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) return null;

    this.posts[index] = {
      ...this.posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.posts[index];
  }

  async deletePost(id: number): Promise<boolean> {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index === -1) return false;

    this.posts.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async searchPosts(query: string): Promise<Post[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Create singleton instance
const dataStorage = new DataStorage();
export default dataStorage;
