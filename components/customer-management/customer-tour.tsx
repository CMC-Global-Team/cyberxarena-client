"use client"

import { UnifiedTour } from "@/components/ui/unified-tour"

interface CustomerTourProps {
  isActive: boolean
  onComplete?: () => void
}

const customerTourSteps = [
  {
    element: '[data-tour="page-title"]',
    popover: {
      title: 'Trang Quản lý Khách hàng',
      description: 'Đây là trang quản lý khách hàng chính. Tại đây bạn có thể xem danh sách khách hàng, thêm mới, chỉnh sửa và quản lý thông tin khách hàng.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="add-customer-btn"]',
    popover: {
      title: 'Thêm Khách hàng Mới',
      description: 'Nhấn vào nút này để thêm một khách hàng mới vào hệ thống. Bạn sẽ cần nhập thông tin như tên, số điện thoại, thẻ thành viên và số dư ban đầu.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="customer-stats"]',
    popover: {
      title: 'Thống kê Khách hàng',
      description: 'Khu vực này hiển thị các thống kê tổng quan về khách hàng như tổng số khách hàng, số khách hàng có tài khoản, tổng số dư và khách hàng mới trong tháng.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="balance-warning"]',
    popover: {
      title: 'Cảnh báo Số dư Thấp',
      description: 'Danh sách này hiển thị các khách hàng có số dư thấp cần được nạp tiền. Bạn có thể nhanh chóng nạp tiền cho họ từ đây.',
      side: "bottom" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="customer-table"]',
    popover: {
      title: 'Bảng Danh sách Khách hàng',
      description: 'Đây là bảng chính hiển thị tất cả thông tin khách hàng. Bạn có thể tìm kiếm, sắp xếp và thực hiện các thao tác như chỉnh sửa, xóa, quản lý tài khoản, nạp tiền và xem lịch sử nạp tiền.',
      side: "top" as const,
      align: 'start' as const
    }
  },
  {
    element: '[data-tour="table-actions"]',
    popover: {
      title: 'Các Thao tác Khách hàng',
      description: 'Trong bảng, mỗi khách hàng có các nút thao tác: Chỉnh sửa thông tin, Xóa khách hàng, Quản lý tài khoản, Nạp tiền và Xem lịch sử nạp tiền.',
      side: "left" as const,
      align: 'start' as const
    }
  }
]

export function CustomerTour({ isActive, onComplete }: CustomerTourProps) {
  return (
    <UnifiedTour 
      isActive={isActive} 
      onComplete={onComplete} 
      steps={customerTourSteps}
    />
  )
}
