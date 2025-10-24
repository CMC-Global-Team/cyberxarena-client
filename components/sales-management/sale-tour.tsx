"use client"

import { UnifiedTour } from "@/components/ui/unified-tour"

interface SaleTourProps {
  isActive: boolean
  onComplete?: () => void
}

const saleTourSteps = [
  {
    element: '[data-tour="page-title"]',
    popover: {
      title: "Trang Quản lý Bán hàng & Hoàn tiền",
      description: "Đây là trang quản lý bán hàng chính. Tại đây bạn có thể tạo hóa đơn, xem thống kê doanh số và xử lý yêu cầu hoàn tiền.",
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="sale-stats"]',
    popover: {
      title: "Thống kê doanh số",
      description: "Đây là thống kê tổng quan về doanh số bán hàng, bao gồm tổng hóa đơn, doanh thu, giá trị trung bình và số sản phẩm đã bán.",
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="add-sale-button"]',
    popover: {
      title: "Tạo hóa đơn mới",
      description: "Nhấp vào đây để tạo hóa đơn bán hàng mới. Bạn có thể chọn khách hàng, thêm sản phẩm và áp dụng giảm giá.",
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="sale-search"]',
    popover: {
      title: "Tìm kiếm hóa đơn",
      description: "Sử dụng thanh tìm kiếm để lọc hóa đơn theo ID, tên khách hàng hoặc các tiêu chí khác.",
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="sale-actions"]',
    popover: {
      title: "Thao tác hóa đơn",
      description: "Tại đây bạn có thể xem chi tiết, chỉnh sửa, hoàn tiền hoặc cập nhật trạng thái hóa đơn. Nhấp vào biểu tượng ba chấm để xem các tùy chọn.",
      side: "left" as const,
      align: 'start' as const
    }
  }
]

export function SaleTour({ isActive, onComplete }: SaleTourProps) {
  return (
    <UnifiedTour 
      isActive={isActive} 
      onComplete={onComplete} 
      steps={saleTourSteps}
    />
  )
}
