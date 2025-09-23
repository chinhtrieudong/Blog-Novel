"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  role: string;
  avatar?: string;
}

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết của người dùng
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-4">
            <img
              className="h-16 w-16 rounded-full"
              src={user.avatar || "/placeholder.svg"}
              alt={user.name}
            />
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Ngày tham gia</Label>
              <p className="text-sm text-gray-600">{user.joinDate}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Trạng thái</Label>
              <p className="text-sm text-gray-600">{user.status}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">ID</Label>
              <p className="text-sm text-gray-600">{user.id}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
