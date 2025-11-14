import { promises as fs } from "fs";
import path from "path";

export interface NovelComment {
  id: number;
  novelId: number;
  authorId: number;
  author: {
    id: number;
    username: string;
    avatarUrl: string;
  };
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");

class CommentDataStorage {
  private comments: NovelComment[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing comments
      try {
        const data = await fs.readFile(COMMENTS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.comments = parsed.comments || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, start with empty array
        this.comments = [];
        this.nextId = 1;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing comment storage:", error);
      this.comments = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        comments: this.comments,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving comments to file:", error);
    }
  }

  async getAllComments(): Promise<NovelComment[]> {
    return [...this.comments];
  }

  async getCommentsByNovelId(novelId: number): Promise<NovelComment[]> {
    return this.comments.filter((comment) => comment.novelId === novelId);
  }

  async getCommentById(id: number): Promise<NovelComment | null> {
    return this.comments.find((comment) => comment.id === id) || null;
  }

  async createComment(
    commentData: Omit<NovelComment, "id" | "createdAt" | "updatedAt">
  ): Promise<NovelComment> {
    const now = new Date().toISOString();
    const newComment: NovelComment = {
      ...commentData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.comments.unshift(newComment);
    await this.saveToFile();

    return newComment;
  }

  async updateComment(
    id: number,
    updates: Partial<NovelComment>
  ): Promise<NovelComment | null> {
    const index = this.comments.findIndex((comment) => comment.id === id);
    if (index === -1) return null;

    this.comments[index] = {
      ...this.comments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.comments[index];
  }

  async deleteComment(id: number): Promise<boolean> {
    const index = this.comments.findIndex((comment) => comment.id === id);
    if (index === -1) return false;

    this.comments.splice(index, 1);
    await this.saveToFile();
    return true;
  }
}

// Create singleton instance
const commentDataStorage = new CommentDataStorage();
export default commentDataStorage;
