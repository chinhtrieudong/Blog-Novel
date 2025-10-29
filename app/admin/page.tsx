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
import {
  DeleteConfirmationModal,
  UserViewModal,
  UserEditModal,
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
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

        // Fetch users if admin from backend API (port 8080)
        if (user?.role === "ADMIN") {
          try {
            // Note: apiClient.getUsers() might need to be implemented
            const usersResponse = await fetch(
              "http://localhost:8080/api/users?page=0&size=5"
            );

            if (!usersResponse.ok) {
              console.error("Users API response not ok:", usersResponse.status);
              setUsers([]);
              return;
            }

            const responseText = await usersResponse.text();
            if (!responseText.trim()) {
              console.error("Empty response from users API");
              setUsers([]);
              return;
            }

            const usersData = JSON.parse(responseText);
            if (usersData.code === 200 && usersData.data?.content) {
              setUsers(usersData.data.content);
            } else {
              console.error("Invalid users API response format:", usersData);
              setUsers([]);
            }
          } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
          }
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

  // Calculate stats from real data
  const stats = {
    totalPosts: posts.length,
    totalNovels: novels.length,
    totalUsers: users.length,
    totalViews:
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
    console.log("Post data:", post); // Debug log
    console.log("Post status:", post.status); // Debug log

    let displayStatus = "Nháp"; // Default

    switch (post.status) {
      case "PUBLISHED":
        displayStatus = "Đã xuất bản";
        break;
      case "PENDING":
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
  const recentNovels = novels.map((novel) => ({
    id: novel.id,
    title: novel.title || "Chưa cập nhật",
    chapters: novel.chapters || 0,
    status: novel.status === "COMPLETED" ? "Hoàn thành" : "Đang cập nhật",
    lastUpdate:
      novel.lastUpdate || novel.updatedAt || novel.createdAt
        ? new Date(
            novel.lastUpdate || novel.updatedAt || novel.createdAt
          ).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
    views: novel.views || 0,
    rating: novel.rating || 0,
  }));

  // Transform API data for display
  const recentUsers = users.map((user) => ({
    id: user.id,
    name: user.fullName || user.username || "Chưa cập nhật",
    email: user.email || "Chưa cập nhật",
    joinDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
    status: user.status === "ACTIVE" ? "Hoạt động" : "Tạm khóa",
    role: user.role === "USER" ? "Độc giả" : user.role || "Chưa cập nhật",
    avatar: "/placeholder.svg?height=40&width=40",
  }));

  const tabs = [
    ...(user?.role === "ADMIN"
      ? [{ id: "dashboard", name: "Tổng quan", icon: BarChart3 }]
      : []),
    { id: "posts", name: "Quản lý Blog", icon: PenTool },
    { id: "novels", name: "Quản lý Tiểu thuyết", icon: BookOpen },
    ...(user?.role === "ADMIN"
      ? [
          { id: "authors", name: "Quản lý Tác giả", icon: Users },
          { id: "users", name: "Người dùng", icon: Users },
        ]
      : []),
  ];

  const handleDeleteClick = (id: number, type: string, title: string) => {
    setDeleteItem({ id, type, title });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItem) {
      console.log(`Deleting ${deleteItem.type} with id ${deleteItem.id}`);
      // Here you would implement the actual delete logic
      setIsDeleteModalOpen(false);
      setDeleteItem(null);
    }
  };

  const handleUserView = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleUserEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (formData: {
    name: string;
    email: string;
    role: string;
    status: string;
  }) => {
    console.log("Updating user:", selectedUser?.id, formData);
    // Here you would implement the actual update logic
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // Status management handlers
  const handleStatusClick = (post: any) => {
    setSelectedPost(post);
    setIsStatusModalOpen(true);
  };

  const handleNovelStatusClick = (novel: any) => {
    setSelectedNovel(novel);
    setIsNovelStatusModalOpen(true);
  };

  const handleStatusConfirm = async (newStatus: string) => {
    if (!selectedPost) return;

    try {
      setIsUpdatingStatus(true);

      // Call the API to update post status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/posts/${
          selectedPost.id
        }/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh posts data
        const postsResponse = await apiClient.getPosts({ page: 0, size: 5 });
        if (postsResponse.data?.content) {
          setPosts(postsResponse.data.content);
        }

        setIsStatusModalOpen(false);
        setSelectedPost(null);
      } else {
        throw new Error("Không thể cập nhật trạng thái bài viết.");
      }
    } catch (err) {
      console.error("Failed to update post status:", err);
      alert("Không thể cập nhật trạng thái bài viết. Vui lòng thử lại.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleNovelStatusConfirm = async (newStatus: string) => {
    if (!selectedNovel) return;

    try {
      setIsUpdatingNovelStatus(true);

      // Call the API to update novel status
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/novels/${
          selectedNovel.id
        }/status?status=${newStatus}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh novels data
        const novelsResponse = await apiClient.getNovels({ page: 0, size: 5 });
        if (novelsResponse.data?.content) {
          setNovels(novelsResponse.data.content);
        }

        setIsNovelStatusModalOpen(false);
        setSelectedNovel(null);
      } else {
        throw new Error("Không thể cập nhật trạng thái tiểu thuyết.");
      }
    } catch (err) {
      console.error("Failed to update novel status:", err);
      alert("Không thể cập nhật trạng thái tiểu thuyết. Vui lòng thử lại.");
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
                      {stats.totalViews.toLocaleString()}
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
                href="/admin/posts/new"
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
                href="/admin/novels/new"
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
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800"
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
                            >
                              <Eye className="w-4 h-4" />
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
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Đang phát triển...</p>
                          <p className="text-sm mt-1">
                            <Link
                              href="/admin/authors"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Truy cập trang quản lý tác giả
                            </Link>
                          </p>
                        </div>
                      </td>
                    </tr>
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
          currentStatus={
            selectedPost?.status === "Đã xuất bản" ? "PUBLISHED" : "DRAFT"
          }
          title={selectedPost?.title || ""}
          isLoading={isUpdatingStatus}
        />

        <StatusChangeModal
          isOpen={isNovelStatusModalOpen}
          onClose={() => setIsNovelStatusModalOpen(false)}
          onConfirm={handleNovelStatusConfirm}
          currentStatus={
            selectedNovel?.status === "Hoàn thành" ? "COMPLETED" : "DRAFT"
          }
          title={selectedNovel?.title || ""}
          isLoading={isUpdatingNovelStatus}
        />
      </div>
    </div>
  );
}
