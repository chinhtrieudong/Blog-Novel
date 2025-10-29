import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: string) => void;
  currentStatus: string;
  title: string;
  isLoading?: boolean;
}

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  title,
  isLoading = false,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const statusOptions = [
    {
      value: "DRAFT",
      label: "Nháp",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    {
      value: "PENDING",
      label: "Chờ duyệt",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
      value: "PUBLISHED",
      label: "Đã xuất bản",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      value: "REJECTED",
      label: "Đã từ chối",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  ];

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const handleClose = () => {
    setSelectedStatus(currentStatus); // Reset to current status
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thay đổi trạng thái bài viết</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Bài viết: <span className="font-medium">{title}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Trạng thái hiện tại:{" "}
              <Badge
                className={
                  statusOptions.find((s) => s.value === currentStatus)?.color
                }
              >
                {statusOptions.find((s) => s.value === currentStatus)?.label}
              </Badge>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Chọn trạng thái mới:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    selectedStatus === status.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Badge className={`${status.color} mb-2`}>
                    {status.label}
                  </Badge>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {status.value === "DRAFT" && "Bài viết đang được chỉnh sửa"}
                    {status.value === "PENDING" && "Chờ admin duyệt"}
                    {status.value === "PUBLISHED" && "Công khai cho mọi người"}
                    {status.value === "REJECTED" && "Đã từ chối xuất bản"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || selectedStatus === currentStatus}
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Cập nhật trạng thái
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
