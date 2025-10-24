"use client"

import { UnifiedTour } from "@/components/ui/unified-tour"

interface SessionTourProps {
  isOpen: boolean
  onClose: () => void
}

export function SessionTour({ isOpen, onClose }: SessionTourProps) {
  const steps = [
    {
      element: '[data-tour="page-title"]',
      popover: {
        title: "Quản lý phiên sử dụng",
        description: "Trang này cho phép bạn quản lý tất cả các phiên sử dụng máy tính của khách hàng."
      }
    },
    {
      element: '[data-tour="search-input"]',
      popover: {
        title: "Tìm kiếm phiên",
        description: "Nhập tên khách hàng, ID phiên hoặc tên máy tính để tìm kiếm phiên sử dụng."
      }
    },
    {
      element: '[data-tour="status-filter"]',
      popover: {
        title: "Lọc theo trạng thái",
        description: "Chọn trạng thái phiên để lọc danh sách: Đang hoạt động, Đã kết thúc, hoặc Tất cả."
      }
    },
    {
      element: '[data-tour="add-session-btn"]',
      popover: {
        title: "Thêm phiên mới",
        description: "Tạo phiên sử dụng mới cho khách hàng trên máy tính cụ thể."
      }
    },
    {
      element: '[data-tour="sessions-table"]',
      popover: {
        title: "Danh sách phiên",
        description: "Xem tất cả phiên sử dụng với thông tin chi tiết: khách hàng, máy tính, thời gian, trạng thái."
      }
    },
    {
      element: '[data-tour="session-actions"]',
      popover: {
        title: "Thao tác phiên",
        description: "Nhấn vào nút hành động để xem chi tiết, chỉnh sửa, kết thúc phiên hoặc đổi máy tính."
      }
    }
  ]

  return (
    <UnifiedTour
      isOpen={isOpen}
      onClose={onClose}
      steps={steps}
      tourId="session-tour"
    />
  )
}
