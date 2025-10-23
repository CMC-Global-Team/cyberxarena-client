"use client"

import { useEffect, useRef } from "react"
// @ts-ignore
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface ComputerTourProps {
  isActive: boolean
  onComplete?: () => void
}

export function ComputerTour({ isActive, onComplete }: ComputerTourProps) {
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
            title: 'Trang Quản lý Máy tính',
            description: 'Đây là trang quản lý máy tính chính. Tại đây bạn có thể xem danh sách máy tính, thêm mới, chỉnh sửa và quản lý trạng thái máy tính.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="add-computer-btn"]',
          popover: {
            title: 'Thêm Máy tính Mới',
            description: 'Nhấn vào nút này để thêm một máy tính mới vào hệ thống. Bạn sẽ cần nhập thông tin như tên máy, địa chỉ IP, giá/giờ và cấu hình phần cứng.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="search-filter"]',
          popover: {
            title: 'Tìm kiếm và Lọc',
            description: 'Sử dụng thanh tìm kiếm để tìm máy tính theo tên, IP hoặc cấu hình. Bạn cũng có thể lọc theo trạng thái và sắp xếp theo các tiêu chí khác nhau.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="computer-table"]',
          popover: {
            title: 'Bảng Danh sách Máy tính',
            description: 'Đây là bảng chính hiển thị tất cả thông tin máy tính bao gồm tên, cấu hình, trạng thái và giá/giờ. Bạn có thể thực hiện các thao tác quản lý từ đây.',
            side: "top",
            align: 'start'
          }
        },
        {
          element: '[data-tour="computer-actions"]',
          popover: {
            title: 'Các Thao tác Máy tính',
            description: 'Mỗi máy tính có nút thao tác (3 chấm) để thực hiện các hành động như chỉnh sửa thông tin, xóa máy tính, hoặc chuyển sang chế độ bảo trì.',
            side: "left",
            align: 'start'
          }
        },
        {
          element: '[data-tour="computer-stats"]',
          popover: {
            title: 'Thống kê Máy tính',
            description: 'Khu vực này hiển thị các thống kê tổng quan về máy tính như tổng số máy, số máy đang sử dụng, tổng giờ chạy và số máy cần bảo trì.',
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
