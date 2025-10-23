"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

interface DashboardLoadingProps {
  pageType: 'customers' | 'products' | 'computers' | 'sessions' | 'memberships' | 'discounts'
}

export function DashboardLoading({ pageType }: DashboardLoadingProps) {
  const getPageConfig = () => {
    switch (pageType) {
      case 'customers':
        return {
          title: 'Quản lý khách hàng',
          description: 'Danh sách và thông tin khách hàng, quản lý tài khoản',
          stats: [
            { label: 'Tổng khách hàng', value: '0' },
            { label: 'Khách hàng hoạt động', value: '0' },
            { label: 'Tổng số dư', value: '0₫' },
            { label: 'Khách hàng mới tháng này', value: '0' }
          ]
        }
      case 'products':
        return {
          title: 'Quản lý sản phẩm',
          description: 'Danh sách sản phẩm, dịch vụ và giá cả',
          stats: [
            { label: 'Tổng sản phẩm', value: '0' },
            { label: 'Sản phẩm hoạt động', value: '0' },
            { label: 'Tổng doanh thu', value: '0₫' },
            { label: 'Sản phẩm bán chạy', value: '0' }
          ]
        }
      case 'computers':
        return {
          title: 'Quản lý máy tính',
          description: 'Danh sách máy tính, trạng thái và cấu hình',
          stats: [
            { label: 'Tổng máy tính', value: '0' },
            { label: 'Máy đang hoạt động', value: '0' },
            { label: 'Máy bảo trì', value: '0' },
            { label: 'Máy sẵn sàng', value: '0' }
          ]
        }
      case 'sessions':
        return {
          title: 'Quản lý phiên',
          description: 'Theo dõi phiên sử dụng và thời gian',
          stats: [
            { label: 'Phiên hoạt động', value: '0' },
            { label: 'Tổng thời gian', value: '0h' },
            { label: 'Doanh thu hôm nay', value: '0₫' },
            { label: 'Khách hàng trực tuyến', value: '0' }
          ]
        }
      case 'memberships':
        return {
          title: 'Quản lý gói thành viên',
          description: 'Các gói thành viên và ưu đãi',
          stats: [
            { label: 'Tổng gói', value: '0' },
            { label: 'Gói hoạt động', value: '0' },
            { label: 'Thành viên VIP', value: '0' },
            { label: 'Doanh thu gói', value: '0₫' }
          ]
        }
      case 'discounts':
        return {
          title: 'Quản lý giảm giá',
          description: 'Các chương trình giảm giá và khuyến mãi',
          stats: [
            { label: 'Tổng mã giảm giá', value: '0' },
            { label: 'Mã đang hoạt động', value: '0' },
            { label: 'Đã sử dụng', value: '0' },
            { label: 'Tiết kiệm', value: '0₫' }
          ]
        }
      default:
        return {
          title: 'Đang tải...',
          description: 'Vui lòng chờ trong giây lát',
          stats: []
        }
    }
  }

  const config = getPageConfig()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {config.title}
          </h1>
          <p className="text-muted-foreground">
            {config.description}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.stats.map((stat, index) => (
          <div key={index} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rounded-lg border bg-card">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3 text-muted-foreground">
          <Spinner className="h-5 w-5" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    </div>
  )
}
