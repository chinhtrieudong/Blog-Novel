import { promises as fs } from "fs";
import path from "path";

export interface Author {
  id: number;
  name: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const AUTHORS_FILE = path.join(DATA_DIR, "authors.json");

class AuthorDataStorage {
  private authors: Author[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage().then(() => {
      // Import here to avoid circular dependency
      import("@/lib/novel-data-storage").then(
        ({ default: novelDataStorage }) => {
          this.migrateExistingNovels(novelDataStorage);
        }
      );
    });
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing authors
      try {
        const data = await fs.readFile(AUTHORS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.authors = parsed.authors || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, start with empty array
        this.authors = [];
        this.nextId = 1;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing author storage:", error);
      this.authors = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        authors: this.authors,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(AUTHORS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving authors to file:", error);
    }
  }

  async getAllAuthors(): Promise<Author[]> {
    return [...this.authors];
  }

  async getAuthorById(id: number): Promise<Author | null> {
    return this.authors.find((author) => author.id === id) || null;
  }

  async getAuthorByName(name: string): Promise<Author | null> {
    return this.authors.find((author) => author.name === name) || null;
  }

  async createAuthor(
    authorData: Omit<Author, "id" | "createdAt" | "updatedAt">
  ): Promise<Author> {
    const now = new Date().toISOString();
    const newAuthor: Author = {
      ...authorData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.authors.push(newAuthor);
    await this.saveToFile();

    return newAuthor;
  }

  async updateAuthor(
    id: number,
    updates: Partial<Omit<Author, "id" | "createdAt" | "updatedAt">>
  ): Promise<Author | null> {
    const index = this.authors.findIndex((author) => author.id === id);
    if (index === -1) return null;

    this.authors[index] = {
      ...this.authors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.authors[index];
  }

  async deleteAuthor(id: number): Promise<boolean> {
    const index = this.authors.findIndex((author) => author.id === id);
    if (index === -1) return false;

    this.authors.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async findOrCreateAuthor(name: string): Promise<Author> {
    let author = await this.getAuthorByName(name);
    if (!author) {
      author = await this.createAuthor({ name });
    }
    return author;
  }

  async migrateExistingNovels(novelDataStorage: any): Promise<void> {
    // Import the novel data storage to migrate
    const novels = await novelDataStorage.getAllNovels();

    for (const novel of novels) {
      if (!novel.author_id && novel.author) {
        try {
          // Find or create author based on novel.author (string)
          const authorEntity = await this.findOrCreateAuthor(novel.author);

          // Update novel with author_id
          await novelDataStorage.updateNovel(novel.id, {
            author_id: authorEntity.id,
          });

          console.log(
            `Migrated novel ${novel.id} to author_id ${authorEntity.id}`
          );
        } catch (error) {
          console.error(`Failed to migrate novel ${novel.id}:`, error);
        }
      }
    }
  }
}

// Create singleton instance
const authorDataStorage = new AuthorDataStorage();
export default authorDataStorage;
