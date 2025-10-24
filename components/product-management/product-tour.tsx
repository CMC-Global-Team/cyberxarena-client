"use client"

import { UnifiedTour } from "@/components/ui/unified-tour"

interface ProductTourProps {
  isActive: boolean
  onComplete?: () => void
}

const productTourSteps = [
  {
    element: '[data-tour="page-title"]',
    popover: {
      title: 'Trang Quản lý Sản phẩm',
      description: 'Đây là trang quản lý sản phẩm chính. Tại đây bạn có thể xem danh sách sản phẩm, thêm mới, chỉnh sửa và quản lý thông tin sản phẩm.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="add-product-btn"]',
    popover: {
      title: 'Thêm Sản phẩm Mới',
      description: 'Nhấn vào nút này để thêm một sản phẩm mới vào hệ thống. Bạn sẽ cần nhập thông tin như tên sản phẩm, giá, mô tả và thông tin nhà cung cấp.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="refresh-btn"]',
    popover: {
      title: 'Làm mới Dữ liệu',
      description: 'Nhấn vào nút này để tải lại danh sách sản phẩm từ server. Hữu ích khi bạn muốn cập nhật dữ liệu mới nhất.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="tabs-navigation"]',
    popover: {
      title: 'Điều hướng Tab',
      description: 'Sử dụng các tab để chuyển đổi giữa danh sách sản phẩm và thống kê. Tab "Danh sách sản phẩm" hiển thị bảng quản lý, tab "Thống kê" hiển thị các biểu đồ phân tích.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="product-table"]',
    popover: {
      title: 'Bảng Danh sách Sản phẩm',
      description: 'Đây là bảng chính hiển thị tất cả thông tin sản phẩm. Bạn có thể tìm kiếm, sắp xếp và thực hiện các thao tác như chỉnh sửa, xóa sản phẩm.',
      side: "top" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="product-actions"]',
    popover: {
      title: 'Các Thao tác Sản phẩm',
      description: 'Trong bảng, mỗi sản phẩm có các nút thao tác để chỉnh sửa thông tin, xóa sản phẩm, hoặc xem chi tiết.',
      side: "left" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="product-stats"]',
    popover: {
      title: 'Thống kê Sản phẩm',
      description: 'Tab thống kê hiển thị các biểu đồ và số liệu phân tích về sản phẩm như tổng số sản phẩm, giá trị tồn kho, và các thống kê khác.',
      side: "top" as const,
      align: 'start' as const
    }
  }
]

export function ProductTour({ isActive, onComplete }: ProductTourProps) {
  return (
    <UnifiedTour 
      isActive={isActive} 
      onComplete={onComplete} 
      steps={productTourSteps}
    />
  )
}
