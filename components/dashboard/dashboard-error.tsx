"use client"

interface DashboardErrorProps {
  error: string
  onRetry: () => void
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  )
}
