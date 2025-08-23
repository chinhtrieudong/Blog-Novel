export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
      </div>
    </div>
  )
}
