"use client";

import { useState, useEffect } from "react";
import {
  PenTool,
  BookOpen,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import apiClient from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";
import {
  DeleteConfirmationModal,
  UserViewModal,
  UserEditModal,
  AuthorViewModal,
} from "@/components/admin/modals";
import { StatusChangeModal } from "@/components/admin/modals/StatusChangeModal";

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    id: number;
    type: string;
    title: string;
  } | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuthorViewModalOpen, setIsAuthorViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  // Status change modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Novel status change modal state
  const [isNovelStatusModalOpen, setIsNovelStatusModalOpen] = useState(false);
  const [selectedNovel, setSelectedNovel] = useState<any>(null);
  const [isUpdatingNovelStatus, setIsUpdatingNovelStatus] = useState(false);

  // State for API data
  const [posts, setPosts] = useState<any[]>([]);
  const [novels, setNovels] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch posts from backend API (port 8080)
        try {
          const postsResponse = await apiClient.getPosts({ page: 0, size: 5 });
          if (postsResponse.data?.content) {
            setPosts(postsResponse.data.content);
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
          setPosts([]);
        }

        // Fetch novels from backend API (port 8080)
        try {
          const novelsResponse = await apiClient.getNovels({
            page: 0,
            size: 5,
          });
          if (novelsResponse.data?.content) {
            setNovels(novelsResponse.data.content);
          }
        } catch (error) {
          console.error("Error fetching novels:", error);
          setNovels([]);
        }

        // Fetch authors
        try {
          const authorsResponse = await apiClient.getAuthors();
          if (authorsResponse.data && Array.isArray(authorsResponse.data)) {
            // Get first 5 authors for display (API doesn't use pagination might not limit)
            setAuthors(authorsResponse.data.slice(0, 5));
          } else {
            console.error("No authors data in response");
            setAuthors([]);
          }
        } catch (error) {
          console.error("Error fetching authors:", error);
          setAuthors([]);
        }

        try {
          const usersResponse = await apiClient.getUsers();
          if (usersResponse.data && Array.isArray(usersResponse.data)) {
            // Get first 5 users for display (API doesn't use pagination)
            setUsers(usersResponse.data.slice(0, 5));
          } else {
            console.error("No users data in response");
            setUsers([]);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Only allow admin users
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Truy cập bị từ chối
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bạn không có quyền truy cập trang quản trị. Chỉ dành cho quản trị
              viên.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Quay lại trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats from real data
  const stats = {
    totalPosts: posts.length,
    totalNovels: novels.length,
    totalUsers: users.length,
    viewCount:
      posts.reduce((sum, post) => sum + (post.viewCount || 0), 0) +
      novels.reduce((sum, novel) => sum + (novel.views || 0), 0),
    monthlyGrowth: {
      posts: Math.floor(posts.length * 0.1),
      novels: Math.floor(novels.length * 0.1),
      users: Math.floor(users.length * 0.1),
      views: Math.floor(
        posts.reduce((sum, post) => sum + (post.viewCount || 0), 0) * 0.1
      ),
    },
  };

  // Transform API data for display
  const recentPosts = posts.map((post) => {
    let displayStatus = "Nháp"; // Default

    switch (post.status) {
      case "PUBLISHED":
        displayStatus = "Đã xuất bản";
        break;
      case "PENDING_REVIEW":
        displayStatus = "Chờ duyệt";
        break;
      case "DRAFT":
        displayStatus = "Nháp";
        break;
      case "REJECTED":
        displayStatus = "Đã từ chối";
        break;
      default:
        displayStatus = post.status || "Nháp";
    }

    return {
      id: post.id,
      title: post.title || "Chưa cập nhật",
      status: displayStatus,
      date: post.createdAt
        ? new Date(post.createdAt).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      views: post.viewCount || 0,
      category: post.categories?.[0]?.name || "Chưa cập nhật",
      author: post.author?.username || "Chưa cập nhật",
    };
  });

  // Transform API data for display
  const recentNovels = novels.map((novel) => {
    let displayStatus = "Đang cập nhật"; // Default

    switch (novel.status) {
      case "COMPLETED":
        displayStatus = "Hoàn thành";
        break;
      case "ONGOING":
        displayStatus = "Đang ra mắt";
        break;
      case "DRAFT":
        displayStatus = "Nháp";
        break;
      case "HIATUS":
        displayStatus = "Tạm dừng";
        break;
      case "CANCELLED":
        displayStatus = "Đã hủy";
        break;
      case "DROPPED":
        displayStatus = "Đã dừng";
        break;
      default:
        displayStatus = novel.status || "Đang cập nhật";
    }

    return {
      id: novel.id,
      title: novel.title || "Chưa cập nhật",
      chapters: novel.chapters || 0,
      status: displayStatus,
      lastUpdate:
        novel.lastUpdate || novel.updatedAt || novel.createdAt
          ? new Date(
              novel.lastUpdate || novel.updatedAt || novel.createdAt
            ).toLocaleDateString("vi-VN")
          : "Chưa cập nhật",
      views: novel.views || 0,
      rating: novel.rating || 0,
    };
  });

  // Transform API data for display
  const recentAuthors = authors.map((author) => ({
    id: author.id,
    name: author.name || "Chưa cập nhật",
    bio: author.bio || "Chưa có giới thiệu",
    avatar: author.avatarUrl || "/placeholder.svg?height=40&width=40",
    createdAt: author.createdAt
      ? new Date(author.createdAt).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
  }));

  // Transform API data for display
  const recentUsers = users.map((user) => {
    let displayRole = "Chưa cập nhật";
    switch (user.role) {
      case "READER":
        displayRole = "Độc giả";
        break;
      case "AUTHOR":
        displayRole = "Tác giả";
        break;
      case "ADMIN":
        displayRole = "Quản trị viên";
        break;
      default:
        displayRole = user.role || "Chưa cập nhật";
    }

    let displayStatus = "Tạm khóa";
    switch (user.status) {
      case "ACTIVE":
        displayStatus = "Hoạt động";
        break;
      case "LOCKED":
        displayStatus = "Tạm khóa";
        break;
      case "BANNED":
        displayStatus = "Cấm";
        break;
      default:
        displayStatus = user.status || "Tạm khóa";
    }

    return {
      id: user.id,
      name: user.fullName || user.username || "Chưa cập nhật",
      email: user.email || "Chưa cập nhật",
      joinDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      status: displayStatus,
      role: displayRole,
      avatar: "/placeholder.svg?height=40&width=40",
    };
  });

  const tabs =
    user?.role === "ADMIN"
      ? [
          { id: "dashboard", name: "Tổng quan", icon: BarChart3 },
          { id: "posts", name: "Quản lý Blog", icon: PenTool },
          { id: "novels", name: "Quản lý Tiểu thuyết", icon: BookOpen },
          { id: "authors", name: "Quản lý Tác giả", icon: Users },
          { id: "users", name: "Người dùng", icon: Users },
        ]
      : [];

  const handleDeleteClick = (id: number, type: string, title: string) => {
    setDeleteItem({ id, type, title });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.type === "novel") {
        await apiClient.deleteNovel(deleteItem.id);

        // Refresh novels list
        const novelsResponse = await apiClient.getNovels({ page: 0, size: 5 });
        if (novelsResponse.data?.content) {
          setNovels(novelsResponse.data.content);
        }
      } else if (deleteItem.type === "post") {
        await apiClient.deletePost(deleteItem.id);

        const postsResponse = await apiClient.getPosts({ page: 0, size: 5 });
        if (postsResponse.data?.content) {
          setPosts(postsResponse.data.content);
        }
      } else if (deleteItem.type === "user") {
        await apiClient.deleteUser(deleteItem.id);

        // Refresh users list
        const usersResponse = await apiClient.getUsers();
        if (usersResponse.data && Array.isArray(usersResponse.data)) {
          // Get first 5 users for display (API doesn't use pagination)
          setUsers(usersResponse.data.slice(0, 5));
        }
      } else if (deleteItem.type === "author") {
        await apiClient.deleteAuthor(deleteItem.id);

        // Refresh authors list
        const authorsResponse = await apiClient.getAuthors();
        if (authorsResponse.data && Array.isArray(authorsResponse.data)) {
          // Get first 5 authors for display (API doesn't use pagination might not limit)
          setAuthors(authorsResponse.data.slice(0, 5));
        }
      }

      toast({
        title: "🗑️ Đã xóa",
        description: `${deleteItem.title} đã được xóa.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Lỗi",
        description: "Không thể xóa. Vui lòng thử lại.",
        variant: "destructive",
      });
    }

    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  const handleUserView = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleUserEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleAuthorView = (author: any) => {
    setSelectedAuthor(author);
    setIsAuthorViewModalOpen(true);
  };

  const handleEditSubmit = async (formData: {
    name: string;
    email: string;
    role: string;
    status: string;
  }) => {
    if (!selectedUser?.id) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể xác định người dùng cần cập nhật.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Map Vietnamese display values to backend enum values
      const roleMap: { [key: string]: string } = {
        "Độc giả": "READER",
        "Tác giả": "AUTHOR",
        "Quản trị viên": "ADMIN",
      };

      const statusMap: { [key: string]: string } = {
        "Hoạt động": "ACTIVE",
        "Tạm khóa": "LOCKED",
        Cấm: "BANNED",
      };

      const updateData = {
        username: selectedUser.username, // Keep existing username
        fullName: formData.name,
        email: formData.email,
        role: roleMap[formData.role] || formData.role,
        status: statusMap[formData.status] || formData.status,
      };

      const response = await apiClient.updateUser(selectedUser.id, updateData);

      // Refresh users data
      const usersResponse = await apiClient.getUsers();
      if (usersResponse.data && Array.isArray(usersResponse.data)) {
        // Get first 5 users for display (API doesn't use pagination)
        setUsers(usersResponse.data.slice(0, 5));
      }

      setIsEditModalOpen(false);
      setSelectedUser(null);

      toast({
        title: "✅ Thành công",
        description: "Thông tin người dùng đã được cập nhật.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "❌ Lỗi",
        description:
          "Không thể cập nhật thông tin người dùng. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // Status management handlers
  const handleStatusClick = (post: any) => {
    // Find the original API data to get the correct status enum value
    const originalPost = posts.find((p) => p.id === post.id);
    setSelectedPost(originalPost || post);
    setIsStatusModalOpen(true);
  };

  const handleNovelStatusClick = (novel: any) => {
    // Find the original API data to get the correct status enum value
    const originalNovel = novels.find((n) => n.id === novel.id);
    setSelectedNovel(originalNovel || novel);
    setIsNovelStatusModalOpen(true);
  };

  const handleStatusConfirm = async (newStatus: string) => {
    if (!selectedPost) return;

    try {
      setIsUpdatingStatus(true);

      // Call the API to update post status using apiClient for auth handling
      const response = await apiClient.updatePostStatus(
        selectedPost.id,
        newStatus
      );

      if (response) {
        // Refresh posts data
        const postsResponse = await apiClient.getPosts({ page: 0, size: 5 });
        if (postsResponse.data?.content) {
          setPosts(postsResponse.data.content);
        }

        setIsStatusModalOpen(false);
        setSelectedPost(null);

        toast({
          title: "✅ Thành công",
          description: "Trạng thái bài viết đã được cập nhật.",
          variant: "default",
        });
      } else {
        throw new Error("Không thể cập nhật trạng thái bài viết.");
      }
    } catch (err) {
      console.error("Failed to update post status:", err);
      toast({
        title: "❌ Lỗi",
        description:
          "Không thể cập nhật trạng thái bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleNovelStatusConfirm = async (newStatus: string) => {
    if (!selectedNovel) return;

    try {
      setIsUpdatingNovelStatus(true);

      // Call the API to update novel status using apiClient for auth handling
      const response = await apiClient.updateNovelStatus(
        selectedNovel.id,
        newStatus
      );

      if (response) {
        // Refresh novels data
        const novelsResponse = await apiClient.getNovels({ page: 0, size: 5 });
        if (novelsResponse.data?.content) {
          setNovels(novelsResponse.data.content);
        }

        setIsNovelStatusModalOpen(false);
        setSelectedNovel(null);

        toast({
          title: "✅ Thành công",
          description: "Trạng thái tiểu thuyết đã được cập nhật.",
          variant: "default",
        });
      } else {
        throw new Error("Không thể cập nhật trạng thái tiểu thuyết.");
      }
    } catch (err) {
      console.error("Failed to update novel status:", err);
      toast({
        title: "❌ Lỗi",
        description:
          "Không thể cập nhật trạng thái tiểu thuyết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingNovelStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý nội dung blog và tiểu thuyết của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-purple-500 text-purple-600 dark:text-purple-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <PenTool className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tổng bài viết
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalPosts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tổng tiểu thuyết
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalNovels}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Người dùng
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Lượt xem
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats.viewCount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Bài viết gần đây
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {post.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{post.date}</span>
                            <Eye className="w-3 h-3 ml-3 mr-1" />
                            <span>{post.views} lượt xem</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            post.status === "Đã xuất bản"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          }`}
                        >
                          {post.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Tiểu thuyết gần đây
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentNovels.map((novel) => (
                      <div
                        key={novel.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {novel.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <BookOpen className="w-3 h-3 mr-1" />
                            <span>{novel.chapters} chương</span>
                            <Calendar className="w-3 h-3 ml-3 mr-1" />
                            <span>{novel.lastUpdate}</span>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            novel.status === "Hoàn thành"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          }`}
                        >
                          {novel.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Management Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý Blog
              </h2>
              <Link
                href="/blog/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo bài viết mới
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleStatusClick(post)}
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 hover:shadow-md transition-all duration-200 cursor-pointer border-2 ${
                                post.status === "Đã xuất bản"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
                                  : post.status === "Chờ duyệt"
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                  : post.status === "Đã từ chối"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              }`}
                              title="Nhấp để thay đổi trạng thái"
                            >
                              <svg
                                className="w-3 h-3 mr-1 opacity-60"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {post.status}
                            </button>
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              (Nhấp để đổi)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {/* <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button> */}
                            <Link
                              href={`/blog/${post.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(post.id, "post", post.title)
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Novels Management Tab */}
        {activeTab === "novels" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý Tiểu thuyết
              </h2>
              <Link
                href="/novels/new"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tạo tiểu thuyết mới
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Số chương
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Cập nhật cuối
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentNovels.map((novel) => (
                      <tr key={novel.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {novel.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {novel.chapters}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleNovelStatusClick(novel)}
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 hover:shadow-md transition-all duration-200 cursor-pointer border-2 ${
                                novel.status === "Hoàn thành"
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800"
                                  : novel.status === "Đang ra mắt"
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                                  : novel.status === "Tạm dừng"
                                  ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800"
                                  : novel.status === "Đã hủy"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
                                  : novel.status === "Đã dừng"
                                  ? "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800"
                                  : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800"
                              }`}
                              title="Nhấp để thay đổi trạng thái"
                            >
                              <svg
                                className="w-3 h-3 mr-1 opacity-60"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {novel.status}
                            </button>
                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                              (Nhấp để đổi)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {novel.lastUpdate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/novels/${novel.id}`}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="Xem tiểu thuyết"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/novels/${novel.id}/chapters`}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                              title="Quản lý chương"
                            >
                              <BookOpen className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  novel.id,
                                  "novel",
                                  novel.title
                                )
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Xóa tiểu thuyết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Authors Management Tab */}
        {activeTab === "authors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý Tác giả
              </h2>
              <Link
                href="/admin/authors/new"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm tác giả mới
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tên tác giả
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Giới thiệu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Avatar
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentAuthors.map((author) => (
                      <tr key={author.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full mr-3"
                              src={author.avatar || "/placeholder.svg"}
                              alt={author.name}
                            />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {author.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                            {author.bio}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={
                              author.avatar ||
                              "/placeholder.svg?height=32&width=32"
                            }
                            alt={author.name}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleAuthorView(author)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="Xem chi tiết tác giả"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/admin/authors/edit/${author.id}`}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  author.id,
                                  "author",
                                  author.name
                                )
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý Người dùng
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Tổng: {stats.totalUsers.toLocaleString()} người dùng
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Người dùng hoạt động
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {(stats.totalUsers * 0.85).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tăng trưởng tháng này
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      +{stats.monthlyGrowth.users}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tỷ lệ hoạt động
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      85%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Người dùng mới nhất
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Người dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.status === "Hoạt động"
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleUserView(user)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUserEdit(user)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(user.id, "user", user.name)
                              }
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          itemType={deleteItem?.type || ""}
          itemTitle={deleteItem?.title || ""}
        />

        <UserViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />

        <UserEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          user={selectedUser}
        />

        <StatusChangeModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          onConfirm={handleStatusConfirm}
          currentStatus={selectedPost?.status || ""}
          title={selectedPost?.title || ""}
          isLoading={isUpdatingStatus}
        />

        <StatusChangeModal
          isOpen={isNovelStatusModalOpen}
          onClose={() => setIsNovelStatusModalOpen(false)}
          onConfirm={handleNovelStatusConfirm}
          currentStatus={selectedNovel?.status || ""}
          title={selectedNovel?.title || ""}
          isLoading={isUpdatingNovelStatus}
          type="novel"
        />

        <AuthorViewModal
          isOpen={isAuthorViewModalOpen}
          onClose={() => setIsAuthorViewModalOpen(false)}
          author={selectedAuthor}
        />
      </div>
    </div>
  );
}
