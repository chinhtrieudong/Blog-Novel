import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Eye,
  Tag,
  User,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react";
import apiClient from "@/lib/api-client";
import { PostResponse, CommentResponse } from "@/types/api";
import CommentsSection from "@/components/comments-section";

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt((await params).id);

  // Initialize with fallbacks
  let postData: PostResponse | null = null;
  let comments: CommentResponse[] = [];
  let relatedPosts: PostResponse[] = [];

  try {
    // Fetch post data
    const postResponse = await apiClient.getPostById(id);
    if (!postResponse.data) {
      notFound();
    }
    postData = postResponse.data;

    // Increment views (silence errors)
    try {
      await apiClient.incrementPostViews(id);
    } catch (error) {
      // Silently fail view increment - not critical
      console.log("Could not increment views:", error);
    }

    // Fetch comments (silence errors for optional content)
    try {
      const commentsResponse = await apiClient.getPostComments(id);
      comments = commentsResponse.data || [];
    } catch (error) {
      console.log("Could not fetch comments:", error);
      comments = [];
    }

    // Fetch related posts (silence errors for optional content)
    if (postData.categories?.[0]?.id) {
      try {
        const relatedPostsResponse = await apiClient.getPosts({
          categoryId: postData.categories[0].id,
          size: 3,
        });
        relatedPosts = relatedPostsResponse.data?.content || [];
      } catch (error) {
        console.log("Could not fetch related posts:", error);
        relatedPosts = [];
      }
    }
  } catch (error) {
    console.log("Error fetching post data:", error);
    notFound();
  }

  // Helper function to decode common HTML entities (for server-side compatibility)
  const decodeHtmlEntities = (text: string) => {
    // Simple regex-based decoding for common Vietnamese entities
    return text
      .replace(/&aacute;/g, "á")
      .replace(/&agrave;/g, "à")
      .replace(/&acirc;/g, "â")
      .replace(/&atilde;/g, "ã")
      .replace(/&eacute;/g, "é")
      .replace(/&egrave;/g, "è")
      .replace(/&ecirc;/g, "ê")
      .replace(/&iacute;/g, "í")
      .replace(/&oacute;/g, "ó")
      .replace(/&ograve;/g, "ò")
      .replace(/&ocirc;/g, "ô")
      .replace(/&otilde;/g, "õ")
      .replace(/&uacute;/g, "ú")
      .replace(/&ugrave;/g, "ù")
      .replace(/&ucirc;/g, "û")
      .replace(/&yacute;/g, "ý")
      .replace(/&ygrave;/g, "ỳ")
      .replace(/&Aacute;/g, "Á")
      .replace(/&Agrave;/g, "À")
      .replace(/&Acirc;/g, "Â")
      .replace(/&Atilde;/g, "Ã")
      .replace(/&Eacute;/g, "É")
      .replace(/&Egrave;/g, "È")
      .replace(/&Ecirc;/g, "Ê")
      .replace(/&Iacute;/g, "Í")
      .replace(/&Oacute;/g, "Ó")
      .replace(/&Ograve;/g, "Ò")
      .replace(/&Ocirc;/g, "Ô")
      .replace(/&Otilde;/g, "Õ")
      .replace(/&Uacute;/g, "Ú")
      .replace(/&Ugrave;/g, "Ù")
      .replace(/&Ucirc;/g, "Û")
      .replace(/&Yacute;/g, "Ý")
      .replace(/&nbsp;/g, " ")
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/&#39;/g, "'");
  };

  // Map to expected structure
  const post = {
    id: postData.id,
    title: postData.title,
    content: postData.content,
    excerpt: postData.excerpt || postData.title,
    category: postData.categories[0]?.name || "Tin tức",
    date: new Date(postData.createdAt).toLocaleDateString("vi-VN"),
    views: postData.viewCount,
    image: postData.coverImage || "/placeholder.jpg",
    author: {
      name: postData.authorName,
      avatar: "/placeholder-user.jpg", // Placeholder until author API allows public access
      bio: "", // Placeholder until author API allows public access
    },
    tags: postData.tags.map((tag) => tag.name),
    readTime: "5 phút đọc",
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                <Tag className="w-3 h-3 mr-1" />
                {post.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {post.author.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Share2 className="w-5 h-5" />
                  <span>Chia sẻ</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  <Bookmark className="w-5 h-5" />
                  <span>Lưu</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{post.views.toLocaleString()} lượt xem</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <CommentsSection postId={postData.id} initialComments={comments} />

        {/* Related Posts */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Bài viết liên quan
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost: PostResponse) => (
              <article
                key={relatedPost.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                  <img
                    src={relatedPost.coverImage || "/placeholder.jpg"}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2">
                    {relatedPost.categories[0]?.name || "Tin tức"}
                  </span>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {relatedPost.title}
                    test
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {decodeHtmlEntities(
                      relatedPost.excerpt || relatedPost.title
                    )}
                  </p>
                  <Link
                    href={`/blog/${relatedPost.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Đọc tiếp →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
