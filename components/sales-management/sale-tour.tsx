"use client"

import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const steps = [
  {
    element: '[data-tour="sale-stats"]',
    popover: {
      title: "Thống kê doanh số",
      description: "Đây là thống kê tổng quan về doanh số bán hàng, bao gồm tổng hóa đơn, doanh thu, giá trị trung bình và số sản phẩm đã bán.",
    }
  },
  {
    element: '[data-tour="sale-actions"]',
    popover: {
      title: "Thao tác hóa đơn",
      description: "Tại đây bạn có thể xem chi tiết, chỉnh sửa hoặc xóa hóa đơn. Nhấp vào biểu tượng ba chấm để xem các tùy chọn.",
    }
  },
  {
    element: '[data-tour="add-sale-button"]',
    popover: {
      title: "Tạo hóa đơn mới",
      description: "Nhấp vào đây để tạo hóa đơn bán hàng mới. Bạn có thể chọn khách hàng, thêm sản phẩm và áp dụng giảm giá.",
    }
  },
  {
    element: '[data-tour="sale-search"]',
    popover: {
      title: "Tìm kiếm hóa đơn",
      description: "Sử dụng thanh tìm kiếm để lọc hóa đơn theo ID, tên khách hàng hoặc các tiêu chí khác.",
    }
  },
]

export function SaleTour() {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: steps,
      popoverClass: 'driverjs-theme',
      onDestroyStarted: () => {
        if (!driverObj.hasNextStep()) {
          driverObj.destroy()
        }
      }
    })
    
    driverObj.drive()
  }

  return (
    <button
      onClick={startTour}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      data-tour="sale-tour-button"
    >
      Hướng dẫn sử dụng
    </button>
  )
}
