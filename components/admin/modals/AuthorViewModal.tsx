"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Author {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  createdAt: string;
}

interface AuthorViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: Author | null;
}

export function AuthorViewModal({
  isOpen,
  onClose,
  author,
}: AuthorViewModalProps) {
  if (!author) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết tác giả</DialogTitle>
          <DialogDescription>Thông tin chi tiết của tác giả</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center space-x-4">
            <img
              className="h-20 w-20 rounded-full"
              src={author.avatar || "/placeholder.svg"}
              alt={author.name}
            />
            <div>
              <h3 className="text-xl font-semibold">{author.name}</h3>
              <p className="text-sm text-gray-500">ID: {author.id}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Giới thiệu</Label>
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {author.bio || "Chưa có giới thiệu"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Ngày tạo</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {author.createdAt}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Avatar URL</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                  {author.avatar || "Không có"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
