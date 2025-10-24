"use client"

import { UnifiedTour } from "@/components/ui/unified-tour"

interface RevenueTourProps {
  isActive: boolean
  onComplete?: () => void
}

const revenueTourSteps = [
  {
    element: '[data-tour="page-title"]',
    popover: {
      title: 'Trang Quản lý Doanh thu',
      description: 'Đây là trang quản lý doanh thu chính. Tại đây bạn có thể xem thống kê doanh thu, tạo báo cáo và theo dõi hiệu suất kinh doanh.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="revenue-stats"]',
    popover: {
      title: 'Thống kê Doanh thu',
      description: 'Khu vực này hiển thị các thống kê tổng quan về doanh thu như tổng doanh thu, doanh thu từ máy tính, doanh thu bán hàng và tăng trưởng.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="revenue-chart"]',
    popover: {
      title: 'Biểu đồ Doanh thu',
      description: 'Biểu đồ trực quan hiển thị xu hướng doanh thu theo thời gian. Bạn có thể chuyển đổi giữa các loại biểu đồ khác nhau.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="generate-reports-btn"]',
    popover: {
      title: 'Tạo Báo cáo Doanh thu',
      description: 'Nhấn vào nút này để tạo báo cáo doanh thu cho một khoảng thời gian cụ thể. Hệ thống sẽ tự động tính toán và tạo báo cáo.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="revenue-table"]',
    popover: {
      title: 'Bảng Doanh thu Chi tiết',
      description: 'Bảng này hiển thị tất cả báo cáo doanh thu đã tạo. Bạn có thể tìm kiếm, sắp xếp và thực hiện các thao tác như xem chi tiết, tính lại báo cáo.',
      side: "top" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="date-range-filter"]',
    popover: {
      title: 'Bộ lọc Thời gian',
      description: 'Sử dụng bộ lọc này để xem doanh thu trong khoảng thời gian cụ thể. Bạn có thể chọn ngày bắt đầu và ngày kết thúc.',
      side: "bottom" as const,
      align: 'start' as const
    }
  }
]

export function RevenueTour({ isActive, onComplete }: RevenueTourProps) {
  return (
    <UnifiedTour 
      isActive={isActive} 
      onComplete={onComplete} 
      steps={revenueTourSteps}
    />
  )
}