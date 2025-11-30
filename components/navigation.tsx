"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import {
  Moon,
  Sun,
  Menu,
  X,
  BookOpen,
  PenTool,
  Home,
  User,
  Settings,
  LogOut,
  UserCircle,
  Heart,
  Users,
  Bookmark,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server side to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Blog & Novel
              </span>
            </Link>
            <div className="flex items-center space-x-8">
              <div className="w-8 h-8" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo và tên website */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Blog & Novel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Blog</span>
            </Link>
            <Link
              href="/novels"
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tiểu thuyết</span>
            </Link>

            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <UserCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {user?.username}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      className="w-64"
                    >
                      {/* Content Creation Section */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tạo nội dung
                      </div>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/blog/new"
                          className="flex items-center space-x-2"
                        >
                          <PenTool className="w-4 h-4" />
                          <span>Viết blog</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* My Content Section */}
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nội dung của tôi
                      </div>

                      {/* My Posts Button */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-posts"
                          className="flex items-center space-x-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Bài viết của tôi</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* My Novels Button */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-novels"
                          className="flex items-center space-x-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Tiểu thuyết của tôi</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Account Management Section */}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quản lý tài khoản
                      </div>

                      {/* Favorite Novels */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/favorites/novels"
                          className="flex items-center space-x-2"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Tiểu thuyết yêu thích</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Followed Authors */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/followed-authors"
                          className="flex items-center space-x-2"
                        >
                          <Users className="w-4 h-4" />
                          <span>Tác giả đã follow</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Saved Posts */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/saved/posts"
                          className="flex items-center space-x-2"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Bài viết đã lưu</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Saved Novels */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/saved/novels"
                          className="flex items-center space-x-2"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Tiểu thuyết đã lưu</span>
                        </Link>
                      </DropdownMenuItem>

                      {/* Admin Section */}
                      {user?.role === "ADMIN" && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Quản trị
                          </div>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="flex items-center space-x-2"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Quản trị hệ thống</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {/* Logout Section */}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <DropdownMenuItem
                        onClick={logout}
                        className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile user indicator - just show username, no dropdown */}
                <div className="md:hidden flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <UserCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="w-4 h-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Theme toggle button với animation */}
          <div className="relative group">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`w-5 h-5 absolute transition-all duration-300 ${
                    theme === "dark"
                      ? "rotate-90 scale-0"
                      : "rotate-0 scale-100"
                  }`}
                />
                <Moon
                  className={`w-5 h-5 absolute transition-all duration-300 ${
                    theme === "dark"
                      ? "rotate-0 scale-100"
                      : "-rotate-90 scale-0"
                  }`}
                />
              </div>
            </button>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/blog"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <PenTool className="w-4 h-4" />
                <span>Blog</span>
              </Link>
              <Link
                href="/novels"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                <span>Tiểu thuyết</span>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* User info section */}
                  <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-3">
                      <UserCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {user?.username}
                      </span>
                    </div>

                    {/* Content Creation */}
                    <div className="mb-3">
                      <div className="space-y-1">
                        <Link
                          href="/blog/new"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <PenTool className="w-4 h-4" />
                          <span>Viết blog</span>
                        </Link>
                        <Link
                          href="/my-posts"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Bài viết của tôi</span>
                        </Link>
                        <Link
                          href="/my-novels"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Tiểu thuyết của tôi</span>
                        </Link>
                      </div>
                    </div>

                    {/* Account Management Section */}
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                        Quản lý tài khoản
                      </div>
                      <div className="space-y-1">
                        <Link
                          href="/favorites/novels"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>Tiểu thuyết yêu thích</span>
                        </Link>
                        <Link
                          href="/followed-authors"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Users className="w-4 h-4" />
                          <span>Tác giả đã follow</span>
                        </Link>
                        <Link
                          href="/saved/posts"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Bài viết đã lưu</span>
                        </Link>
                        <Link
                          href="/saved/novels"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Tiểu thuyết đã lưu</span>
                        </Link>
                      </div>
                    </div>

                    {/* Admin Section */}
                    {user?.role === "ADMIN" && (
                      <div className="mb-3">
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mb-2">
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                            Quản trị
                          </div>
                        </div>
                        <Link
                          href="/admin"
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Quản trị hệ thống</span>
                        </Link>
                      </div>
                    )}

                    {/* Logout Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
