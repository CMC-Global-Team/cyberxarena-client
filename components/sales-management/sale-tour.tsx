"use client"

import { useEffect } from "react"
import { useTour } from "@reactour/tour"

const steps = [
  {
    selector: '[data-tour="sale-stats"]',
    content: "Đây là thống kê tổng quan về doanh số bán hàng, bao gồm tổng hóa đơn, doanh thu, giá trị trung bình và số sản phẩm đã bán.",
  },
  {
    selector: '[data-tour="sale-actions"]',
    content: "Tại đây bạn có thể xem chi tiết, chỉnh sửa hoặc xóa hóa đơn. Nhấp vào biểu tượng ba chấm để xem các tùy chọn.",
  },
  {
    selector: '[data-tour="add-sale-button"]',
    content: "Nhấp vào đây để tạo hóa đơn bán hàng mới. Bạn có thể chọn khách hàng, thêm sản phẩm và áp dụng giảm giá.",
  },
  {
    selector: '[data-tour="sale-search"]',
    content: "Sử dụng thanh tìm kiếm để lọc hóa đơn theo ID, tên khách hàng hoặc các tiêu chí khác.",
  },
]

export function SaleTour() {
  const { setIsOpen, setSteps } = useTour()

  useEffect(() => {
    setSteps(steps)
  }, [setSteps])

  const startTour = () => {
    setIsOpen(true)
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
