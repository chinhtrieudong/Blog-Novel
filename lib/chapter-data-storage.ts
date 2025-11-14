import { promises as fs } from "fs";
import path from "path";

export interface Chapter {
  id: number;
  novelId: number;
  title: string;
  content: string;
  chapterNumber: number;
  views: number;
  likes: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CHAPTERS_FILE = path.join(DATA_DIR, "chapters.json");

class ChapterDataStorage {
  private chapters: Chapter[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing chapters
      try {
        const data = await fs.readFile(CHAPTERS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.chapters = parsed.chapters || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, create sample data
        this.chapters = [
          {
            id: 1,
            novelId: 1,
            title: "Chương 1: Sự bắt đầu",
            content:
              "<p>Đây là nội dung của chương 1. Đây là một câu chuyện thú vị bắt đầu từ đây...</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
            chapterNumber: 1,
            views: 1250,
            likes: 45,
            wordCount: 1500,
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-15T10:00:00Z",
          },
          {
            id: 2,
            novelId: 1,
            title: "Chương 2: Bi kịch xảy ra",
            content:
              "<p>Trong chương này, bi kịch bắt đầu xảy ra. Nhân vật chính đối mặt với nhiều thách thức.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>",
            chapterNumber: 2,
            views: 980,
            likes: 32,
            wordCount: 1450,
            createdAt: "2024-01-22T10:00:00Z",
            updatedAt: "2024-01-22T10:00:00Z",
          },
        ];
        this.nextId = 3;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing chapter storage:", error);
      this.chapters = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        chapters: this.chapters,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(CHAPTERS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving chapters to file:", error);
    }
  }

  async getAllChapters(): Promise<Chapter[]> {
    return [...this.chapters];
  }

  async getChaptersByNovelId(novelId: number): Promise<Chapter[]> {
    return this.chapters.filter((chapter) => chapter.novelId === novelId);
  }

  async getChapterById(id: number): Promise<Chapter | null> {
    return this.chapters.find((chapter) => chapter.id === id) || null;
  }

  async createChapter(
    chapterData: Omit<Chapter, "id" | "createdAt" | "updatedAt">
  ): Promise<Chapter> {
    const now = new Date().toISOString();
    const newChapter: Chapter = {
      ...chapterData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.chapters.unshift(newChapter);
    await this.saveToFile();

    return newChapter;
  }

  async updateChapter(
    id: number,
    updates: Partial<Chapter>
  ): Promise<Chapter | null> {
    const index = this.chapters.findIndex((chapter) => chapter.id === id);
    if (index === -1) return null;

    this.chapters[index] = {
      ...this.chapters[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.chapters[index];
  }

  async deleteChapter(id: number): Promise<boolean> {
    const index = this.chapters.findIndex((chapter) => chapter.id === id);
    if (index === -1) return false;

    this.chapters.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async incrementViews(id: number): Promise<Chapter | null> {
    const index = this.chapters.findIndex((chapter) => chapter.id === id);
    if (index === -1) return null;

    this.chapters[index] = {
      ...this.chapters[index],
      views: this.chapters[index].views + 1,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.chapters[index];
  }
}

// Create singleton instance
const chapterDataStorage = new ChapterDataStorage();
export default chapterDataStorage;
