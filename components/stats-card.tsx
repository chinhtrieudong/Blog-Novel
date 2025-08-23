import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: "blue" | "purple" | "green" | "orange"
  growth?: string
}

export function StatsCard({ title, value, icon: Icon, color, growth }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
        {growth && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tháng này</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">+{growth}</p>
          </div>
        )}
      </div>
    </div>
  )
}
