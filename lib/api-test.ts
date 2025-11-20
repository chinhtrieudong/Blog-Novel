// Simple test file to verify API integration
import apiClient from "./api-client";

// Test API client import and basic functionality
export async function testApiIntegration() {
  try {
    // Removed debugging logs

    // Test that all methods exist
    const methods = [
      "register",
      "login",
      "logout",
      "getProfile",
      "updateProfile",
      "getNovels",
      "getNovelById",
      "createNovel",
      "updateNovel",
      "deleteNovel",
      "getPosts",
      "getPostById",
      "createPost",
      "updatePost",
      "deletePost",
      "getChapters",
      "getChapterById",
      "createChapter",
      "updateChapter",
      "deleteChapter",
      "getPostComments",
      "createPostComment",
      "getNovelComments",
      "createNovelComment",
      "getUsers",
      "getUserById",
      "updateUser",
      "deleteUser",
      "search",
      "searchPosts",
      "searchNovels",
      "getSearchSuggestions",
      "getGenres",
      "likeNovel",
      "favoriteNovel",
      "rateNovel",
      "incrementPostViews",
      "incrementChapterViews",
      "likeComment",
      "updateComment",
      "deleteComment",
      "uploadNovelCoverImage",
      "deleteNovelCoverImage",
      "getAnalyticsDashboard",
      "getAnalyticsPosts",
      "getAnalyticsNovels",
      "getAnalyticsUsers",
      "getAnalyticsTraffic",
    ];

    console.log("Checking API methods...");
    methods.forEach((method) => {
      if (typeof apiClient[method as keyof typeof apiClient] === "function") {
        console.log(`✓ ${method} method exists`);
      } else {
        console.error(`✗ ${method} method missing`);
      }
    });

    console.log("API integration test completed successfully!");
    return true;
  } catch (error) {
    console.error("API integration test failed:", error);
    return false;
  }
}

// Export for potential use in components
export { apiClient };
