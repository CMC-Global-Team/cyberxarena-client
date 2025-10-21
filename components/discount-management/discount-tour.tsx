"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface DiscountTourProps {
  isActive: boolean
  onComplete?: () => void
}

export function DiscountTour({ isActive, onComplete }: DiscountTourProps) {
  const driverRef = useRef<any>(null)

  useEffect(() => {
    if (!isActive) return

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      progressText: 'Bước {{current}} của {{total}}',
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Trước đó',
      doneBtnText: 'Hoàn thành',
      closeBtnText: 'Đóng',
      steps: [
        {
          element: '[data-tour="page-title"]',
          popover: {
            title: 'Trang Quản lý Giảm giá',
            description: 'Đây là trang quản lý giảm giá chính. Tại đây bạn có thể xem danh sách giảm giá, thêm mới, chỉnh sửa và quản lý các loại giảm giá trong hệ thống.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="add-discount-btn"]',
          popover: {
            title: 'Thêm Giảm giá Mới',
            description: 'Nhấn vào nút này để thêm một loại giảm giá mới vào hệ thống. Bạn sẽ cần nhập thông tin như tên giảm giá, phần trăm giảm, điều kiện áp dụng.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="refresh-btn"]',
          popover: {
            title: 'Làm mới Dữ liệu',
            description: 'Nhấn vào nút này để tải lại danh sách giảm giá từ server. Hữu ích khi bạn muốn cập nhật dữ liệu mới nhất.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="tabs-navigation"]',
          popover: {
            title: 'Điều hướng Tab',
            description: 'Sử dụng các tab để chuyển đổi giữa danh sách giảm giá và thống kê. Tab "Danh sách giảm giá" hiển thị bảng quản lý, tab "Thống kê" hiển thị các biểu đồ phân tích.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="discount-table"]',
          popover: {
            title: 'Bảng Danh sách Giảm giá',
            description: 'Đây là bảng chính hiển thị tất cả thông tin giảm giá. Bạn có thể tìm kiếm, sắp xếp và thực hiện các thao tác như chỉnh sửa, xóa giảm giá.',
            side: "top",
            align: 'start'
          }
        },
        {
          element: '[data-tour="discount-actions"]',
          popover: {
            title: 'Các Thao tác Giảm giá',
            description: 'Trong bảng, mỗi giảm giá có các nút thao tác để chỉnh sửa thông tin, xóa giảm giá, hoặc xem chi tiết.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '[data-tour="discount-stats"]',
          popover: {
            title: 'Thống kê Giảm giá',
            description: 'Tab thống kê hiển thị các biểu đồ và số liệu phân tích về giảm giá như tổng số loại giảm giá, hiệu quả áp dụng, và các thống kê khác.',
            side: "top",
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        onComplete?.()
      }
    })

    driverRef.current.drive()

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [isActive, onComplete])

  return null
}
