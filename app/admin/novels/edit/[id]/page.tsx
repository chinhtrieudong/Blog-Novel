"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { ChevronLeft, Save, Send, XCircle } from "lucide-react";
import Link from "next/link";

// Interface for Novel Data (Replace with your actual interface)
interface Novel {
  id: string;
  novelTitle: string;
  author: string;
  genre: string;
  synopsis: string;
  content: string;
  coverImage: string;
  status: string;
}

export default function EditNovelPage({ params }: { params: { id: string } }) {
  const [novel, setNovel] = useState<Novel | null>(null);
  const [novelTitle, setNovelTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("draft");
  const [synopsis, setSynopsis] = useState("");
  const editorRef = useRef<any>(null);
  const router = useRouter();

  const { id } = params;

  const genres = [
    "Fantasy",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Mystery",
    "Historical Fiction",
  ];

  useEffect(() => {
    // Fetch novel data based on ID
    // Replace this with your actual data fetching logic (e.g., from an API)
    async function fetchNovel() {
      // Simulate fetching data
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockNovel: Novel = {
        id: id,
        novelTitle: `Tiểu thuyết ${id}`,
        author: "Tác giả ABC",
        genre: "Fantasy",
        synopsis: "Đây là một tiểu thuyết mẫu.",
        content: "Nội dung tiểu thuyết mẫu.",
        coverImage: "",
        status: "Đang cập nhật",
      };
      setNovelTitle(mockNovel.novelTitle);
      setAuthor(mockNovel.author);
      setGenre(mockNovel.genre);
      setSynopsis(mockNovel.synopsis);
      setCoverImage(mockNovel.coverImage);
      setStatus(mockNovel.status);
      setNovel(mockNovel);
    }

    fetchNovel();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setCoverImage(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current?.getContent();

    const updatedNovelData = {
      id: novel?.id,
      novelTitle,
      author,
      genre,
      synopsis,
      content,
      coverImage,
      status,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated novel data:", updatedNovelData);
    // TODO: Implement API call to update novel
    router.push("/admin/novels");
  };

  if (!novel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/novels"
              className="mr-4 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chỉnh sửa tiểu thuyết
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setStatus("draft")}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu nháp
            </button>
            <button
              onClick={() => setStatus("published")}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline-block mr-2" />
              Xuất bản
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề tiểu thuyết
            </label>
            <input
              type="text"
              value={novelTitle}
              onChange={(e) => setNovelTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tiêu đề tiểu thuyết..."
              required
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tác giả
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thể loại
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Chọn thể loại</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ảnh bìa
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 dark:text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-700
          dark:file:bg-blue-900 dark:file:text-blue-200
          hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-auto object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tóm tắt
            </label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nhập tóm tắt tiểu thuyết..."
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội dung
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={novel.content}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "preview",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/novels"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <XCircle className="w-4 h-4 inline-block mr-2" />
              Hủy bỏ
            </Link>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              <Save className="w-4 h-4 inline-block mr-2" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
