"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface MembershipTourProps {
  isActive: boolean
  onComplete?: () => void
}

export function MembershipTour({ isActive, onComplete }: MembershipTourProps) {
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
            title: 'Trang Quản lý Thẻ Thành viên',
            description: 'Đây là trang quản lý thẻ thành viên chính. Tại đây bạn có thể xem danh sách gói thẻ thành viên, thêm mới, chỉnh sửa và quản lý các loại thẻ thành viên trong hệ thống.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="add-membership-btn"]',
          popover: {
            title: 'Thêm Thẻ Thành viên Mới',
            description: 'Nhấn vào nút này để thêm một gói thẻ thành viên mới vào hệ thống. Bạn sẽ cần nhập thông tin như tên thẻ, giảm giá liên quan, ngưỡng nạp tiền và thiết lập mặc định.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="refresh-btn"]',
          popover: {
            title: 'Làm mới Dữ liệu',
            description: 'Nhấn vào nút này để tải lại danh sách thẻ thành viên từ server. Hữu ích khi bạn muốn cập nhật dữ liệu mới nhất.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="tabs-navigation"]',
          popover: {
            title: 'Điều hướng Tab',
            description: 'Sử dụng các tab để chuyển đổi giữa danh sách thẻ thành viên và thống kê. Tab "Danh sách" hiển thị bảng quản lý, tab "Thống kê" hiển thị các biểu đồ phân tích.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="membership-table"]',
          popover: {
            title: 'Bảng Danh sách Thẻ Thành viên',
            description: 'Đây là bảng chính hiển thị tất cả thông tin thẻ thành viên. Bạn có thể tìm kiếm, sắp xếp và thực hiện các thao tác như chỉnh sửa, xóa thẻ thành viên.',
            side: "top",
            align: 'start'
          }
        },
        {
          element: '[data-tour="membership-actions"]',
          popover: {
            title: 'Các Thao tác Thẻ Thành viên',
            description: 'Trong bảng, mỗi thẻ thành viên có các nút thao tác để chỉnh sửa thông tin, xóa thẻ thành viên, hoặc xem chi tiết.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '[data-tour="membership-stats"]',
          popover: {
            title: 'Thống kê Thẻ Thành viên',
            description: 'Tab thống kê hiển thị các biểu đồ và số liệu phân tích về thẻ thành viên như tổng số loại thẻ, hiệu quả sử dụng, và các thống kê khác.',
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
