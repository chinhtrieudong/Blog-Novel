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
  type?: "post" | "novel";
}

// Default status options for posts
const postStatusOptions = [
  {
    value: "DRAFT",
    label: "Nháp",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "PENDING_REVIEW",
    label: "Chờ duyệt",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    value: "PUBLISHED",
    label: "Đã xuất bản",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "REJECTED",
    label: "Đã từ chối",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
];

// Status options for novels
const novelStatusOptions = [
  {
    value: "DRAFT",
    label: "Nháp",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "ONGOING",
    label: "Đang ra mắt",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    value: "COMPLETED",
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    value: "HIATUS",
    label: "Tạm dừng",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    value: "CANCELLED",
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    value: "DROPPED",
    label: "Đã dừng",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
];

export function StatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  title,
  isLoading = false,
  type = "post", // default to post
}: StatusChangeModalProps) {
  // Choose status options based on type
  const statusOptions =
    type === "novel" ? novelStatusOptions : postStatusOptions;

  // Map Vietnamese display text back to enum values for novels
  const mapStatusToValue = (displayStatus: string): string => {
    if (type === "post") {
      // For posts, currentStatus should already be enum (DRAFT, PUBLISHED, etc.)
      return displayStatus;
    } else {
      // For novels, currentStatus might be Vietnamese text, map it back
      switch (displayStatus) {
        case "Nháp":
          return "DRAFT";
        case "Đang ra mắt":
          return "ONGOING";
        case "Hoàn thành":
          return "COMPLETED";
        case "Tạm dừng":
          return "HIATUS";
        case "Đã hủy":
          return "CANCELLED";
        case "Đã dừng":
          return "DROPPED";
        default:
          return displayStatus; // Default to what's passed
      }
    }
  };

  // Get the current status as enum value for finding the option
  const enumStatus = mapStatusToValue(currentStatus);

  // Initialize selectedStatus with the enum value
  const [selectedStatus, setSelectedStatus] = useState(enumStatus);

  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };

  const handleClose = () => {
    setSelectedStatus(enumStatus); // Reset to current status enum
    onClose();
  };

  // Get description based on status value and type
  const getStatusDescription = (statusValue: string) => {
    if (type === "novel") {
      switch (statusValue) {
        case "DRAFT":
          return "Tiểu thuyết đang được soạn thảo";
        case "ONGOING":
          return "Đang được cập nhật đều đặn";
        case "COMPLETED":
          return "Đã hoàn thành toàn bộ";
        case "HIATUS":
          return "Tạm ngưng cập nhật";
        case "CANCELLED":
          return "Đã bị hủy bỏ";
        case "DROPPED":
          return "Bị bỏ dở không hoàn thành";
        default:
          return "";
      }
    } else {
      // post descriptions
      switch (statusValue) {
        case "DRAFT":
          return "Bài viết đang được chỉnh sửa";
        case "PENDING_REVIEW":
          return "Chờ admin duyệt";
        case "PUBLISHED":
          return "Công khai cho mọi người";
        case "REJECTED":
          return "Bị từ chối xuất bản";
        default:
          return "";
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Thay đổi trạng thái {type === "novel" ? "tiểu thuyết" : "bài viết"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {type === "novel" ? "Tiểu thuyết" : "Bài viết"}:{" "}
              <span className="font-medium">{title}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Trạng thái hiện tại:{" "}
              <Badge
                className={
                  statusOptions.find((s) => s.value === enumStatus)?.color ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {statusOptions.find((s) => s.value === enumStatus)?.label ||
                  currentStatus ||
                  "Unknown"}
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
                    {getStatusDescription(status.value)}
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
