"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface DashboardTourProps {
  onComplete?: () => void
}

export function DashboardTour({ onComplete }: DashboardTourProps) {
  useEffect(() => {
    // Delay để đảm bảo DOM đã render xong
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: 'Tiếp theo',
        prevBtnText: 'Trước đó',
        doneBtnText: 'Hoàn thành',
        progressText: 'Bước {{current}} của {{total}}',
        steps: [
          {
            element: 'aside',
            popover: {
              title: 'Bước 1: Menu điều hướng',
              description: 'Đây là menu chính để điều hướng trong hệ thống. Bạn có thể thu gọn/mở rộng menu bằng nút mũi tên.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:first-child',
            popover: {
              title: 'Bước 2: Dashboard',
              description: 'Trang tổng quan hiện tại, hiển thị thống kê và hoạt động của hệ thống.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(2)',
            popover: {
              title: 'Bước 3: Quản lý khách hàng',
              description: 'Quản lý thông tin khách hàng, tài khoản và lịch sử giao dịch.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(3)',
            popover: {
              title: 'Bước 4: Quản lý máy tính',
              description: 'Theo dõi và quản lý trạng thái các máy tính trong hệ thống.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(4)',
            popover: {
              title: 'Bước 5: Quản lý sản phẩm',
              description: 'Quản lý menu đồ ăn, thức uống và các dịch vụ khác.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(5)',
            popover: {
              title: 'Bước 6: Quản lý giảm giá',
              description: 'Tạo và quản lý các chương trình khuyến mãi, giảm giá.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(6)',
            popover: {
              title: 'Bước 7: Gói thành viên',
              description: 'Quản lý các gói thành viên VIP và ưu đãi đặc biệt.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'nav button:nth-child(7)',
            popover: {
              title: 'Bước 8: Phiên sử dụng',
              description: 'Theo dõi lịch sử và thống kê các phiên chơi của khách hàng.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'main',
            popover: {
              title: 'Bước 9: Nội dung chính',
              description: 'Khu vực hiển thị nội dung chính của từng trang. Hiện tại đang hiển thị dashboard tổng quan.',
              side: "left",
              align: 'start'
            }
          },
          {
            element: 'main .grid',
            popover: {
              title: 'Bước 10: Thống kê tổng quan',
              description: 'Các card thống kê hiển thị số liệu quan trọng: tổng máy, khách hàng, doanh thu và thời gian trung bình.',
              side: "top",
              align: 'center'
            }
          },
          {
            element: 'main .grid:last-child',
            popover: {
              title: 'Bước 11: Báo cáo chi tiết',
              description: 'Các báo cáo chi tiết về hoạt động gần đây và trạng thái máy tính.',
              side: "top",
              align: 'center'
            }
          },
          {
            element: 'aside button:last-child',
            popover: {
              title: 'Bước 12: Chế độ giao diện',
              description: 'Chuyển đổi giữa chế độ sáng và tối để phù hợp với sở thích.',
              side: "right",
              align: 'start'
            }
          },
          {
            element: 'aside button:nth-last-child(2)',
            popover: {
              title: 'Bước 13: Đăng xuất',
              description: 'Nhấn nút này để đăng xuất khỏi hệ thống và quay về trang đăng nhập.',
              side: "right",
              align: 'start'
            }
          }
        ],
        onDestroyed: () => {
          onComplete?.()
        }
      })

      driverObj.drive()
    }, 1500) // Delay 1.5 giây để trang load hoàn toàn

    return () => {
      clearTimeout(timer)
    }
  }, [onComplete])

  return null
}
