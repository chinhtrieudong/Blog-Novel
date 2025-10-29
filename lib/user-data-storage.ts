import { promises as fs } from "fs";
import path from "path";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

class UserDataStorage {
  private users: User[] = [];
  private nextId: number = 1;

  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(DATA_DIR, { recursive: true });

      // Try to load existing users
      try {
        const data = await fs.readFile(USERS_FILE, "utf8");
        const parsed = JSON.parse(data);
        this.users = parsed.users || [];
        this.nextId = parsed.nextId || 1;
      } catch (error) {
        // File doesn't exist, start with empty array
        this.users = [];
        this.nextId = 1;
        await this.saveToFile();
      }
    } catch (error) {
      console.error("Error initializing user storage:", error);
      this.users = [];
      this.nextId = 1;
    }
  }

  private async saveToFile() {
    try {
      const data = {
        users: this.users,
        nextId: this.nextId,
        lastUpdated: new Date().toISOString(),
      };
      await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving users to file:", error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id: this.nextId++,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    await this.saveToFile();

    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    await this.saveToFile();
    return true;
  }

  async searchUsers(query: string): Promise<User[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(
      (user) =>
        user.username.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.fullName?.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// Create singleton instance
const userDataStorage = new UserDataStorage();
export default userDataStorage;
