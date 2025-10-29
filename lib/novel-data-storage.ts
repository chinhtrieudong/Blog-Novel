import { promises as fs } from "fs";
import path from "path";

export interface Novel {
  id: number;
  title: string;
  author_id?: number;
  author?: string; // for backwards compatibility during migration
  description: string;
  genre: string;
  chapters: number;
  status: string;
  rating: number;
  reviews: number;
  views: number;
  likes: number;
  lastUpdate: string;
  cover: string;
  tags: string[];
  publishDate: string;
  totalWords: number;
  averageChapterLength: number;
  createdAt?: string;
  updatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const NOVELS_FILE = path.join(DATA_DIR, "novels.json");

class NovelDataStorage {
  private novels: Novel[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing novels
      try {
        const data = await fs.readFile(NOVELS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.novels = parsed.novels || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, start with empty array
        this.novels = [];
        this.nextId = 1;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing novel storage:", error);
      this.novels = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        novels: this.novels,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(NOVELS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving novels to file:", error);
    }
  }

  async getAllNovels(): Promise<Novel[]> {
    return [...this.novels];
  }

  async getNovelById(id: number): Promise<Novel | null> {
    return this.novels.find((novel) => novel.id === id) || null;
  }

  async createNovel(
    novelData: Omit<Novel, "id" | "createdAt" | "updatedAt">
  ): Promise<Novel> {
    const now = new Date().toISOString();
    const newNovel: Novel = {
      ...novelData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.novels.unshift(newNovel);
    await this.saveToFile();

    return newNovel;
  }

  async updateNovel(
    id: number,
    updates: Partial<Novel>
  ): Promise<Novel | null> {
    const index = this.novels.findIndex((novel) => novel.id === id);
    if (index === -1) return null;

    this.novels[index] = {
      ...this.novels[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.novels[index];
  }

  async deleteNovel(id: number): Promise<boolean> {
    const index = this.novels.findIndex((novel) => novel.id === id);
    if (index === -1) return false;

    this.novels.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async searchNovels(query: string): Promise<Novel[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.novels.filter(
      (novel) =>
        novel.title.toLowerCase().includes(lowercaseQuery) ||
        (novel.author && novel.author.toLowerCase().includes(lowercaseQuery)) ||
        novel.description.toLowerCase().includes(lowercaseQuery) ||
        novel.genre.toLowerCase().includes(lowercaseQuery) ||
        novel.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Create singleton instance
const novelDataStorage = new NovelDataStorage();
export default novelDataStorage;
