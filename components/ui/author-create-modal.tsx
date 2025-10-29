"use client";

import * as React from "react";
import { useState } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/lib/api-client";
import { AuthorRequest } from "@/types/api";

interface AuthorCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthorCreated: (author: any) => void;
}

export function AuthorCreateModal({
  open,
  onOpenChange,
  onAuthorCreated,
}: AuthorCreateModalProps) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError("Tên tác giả là bắt buộc");
      return;
    }

    if (name.length < 2 || name.length > 255) {
      setError("Tên tác giả phải có từ 2 đến 255 ký tự");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const authorData: AuthorRequest = {
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: avatar || undefined,
      };

      const response = await apiClient.createAuthor(authorData);

      if (response.data) {
        onAuthorCreated(response.data);
        handleClose();
      }
    } catch (error: any) {
      console.error("Error creating author:", error);
      setError(
        error.message || "Có lỗi xảy ra khi tạo tác giả. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setBio("");
    setAvatar(null);
    setAvatarPreview("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Tác Giả Mới</DialogTitle>
          <DialogDescription>
            Thêm thông tin chi tiết cho tác giả mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên tác giả *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Nhập tiểu sử tác giả..."
              rows={3}
            />
          </div>

          {/* Avatar Field */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Ảnh đại diện</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-16 w-16 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg border flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Chọn file ảnh (JPG, PNG, GIF)
                </p>
              </div>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAvatar(null);
                    setAvatarPreview("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo tác giả"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
