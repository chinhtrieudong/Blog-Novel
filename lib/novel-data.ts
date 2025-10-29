export interface Novel {
  id: number;
  title: string;
  author: string;
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
}

export interface Chapter {
  id: number;
  novelId: number;
  title: string;
  content: string;
  publishDate: string;
  views: number;
  wordCount: number;
  likes: number;
  comments: number;
}

export interface ChapterComment {
  id: number;
  user: string;
  avatar: string;
  comment: string;
  time: string;
  likes: number;
}

// Novels data will be loaded from storage
export const novels: Novel[] = [];

// Chapters data will be loaded from storage
export const chapters: Chapter[] = [];

// Chapter comments data will be loaded from storage
export const chapterComments: ChapterComment[] = [];

// Helper functions
export function getNovelById(id: number): Novel | undefined {
  return novels.find((novel) => novel.id === id);
}

export function getChapterById(
  chapterId: number,
  novelId: number
): Chapter | undefined {
  return chapters.find(
    (chapter) => chapter.id === chapterId && chapter.novelId === novelId
  );
}

export function getChaptersByNovelId(novelId: number): Chapter[] {
  return chapters.filter((chapter) => chapter.novelId === novelId);
}

export function getNextChapter(
  currentChapterId: number,
  novelId: number
): Chapter | undefined {
  const novelChapters = getChaptersByNovelId(novelId);
  const currentIndex = novelChapters.findIndex(
    (chapter) => chapter.id === currentChapterId
  );
  return currentIndex < novelChapters.length - 1
    ? novelChapters[currentIndex + 1]
    : undefined;
}

export function getPrevChapter(
  currentChapterId: number,
  novelId: number
): Chapter | undefined {
  const novelChapters = getChaptersByNovelId(novelId);
  const currentIndex = novelChapters.findIndex(
    (chapter) => chapter.id === currentChapterId
  );
  return currentIndex > 0 ? novelChapters[currentIndex - 1] : undefined;
}
