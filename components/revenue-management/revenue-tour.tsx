"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RevenueTour() {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '[data-tour="revenue-stats"]',
          popover: {
            title: 'Thống kê doanh thu',
            description: 'Xem tổng quan về doanh thu, doanh thu sử dụng máy, doanh thu bán hàng và tăng trưởng.',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '[data-tour="revenue-chart"]',
          popover: {
            title: 'Biểu đồ doanh thu',
            description: 'Phân tích doanh thu qua các biểu đồ trực quan với nhiều loại chart khác nhau.',
            side: "top",
            align: 'start'
          }
        },
        {
          element: '[data-tour="revenue-search"]',
          popover: {
            title: 'Tìm kiếm báo cáo',
            description: 'Tìm kiếm và lọc các báo cáo doanh thu theo ID, ngày hoặc số tiền.',
            side: "bottom",
            align: 'start'
          }
        }
      ],
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Trước đó',
      doneBtnText: 'Hoàn thành',
      progressText: 'Bước {{current}} của {{total}}'
    })

    driverObj.drive()
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={startTour}
      className="flex items-center space-x-2"
    >
      <HelpCircle className="h-4 w-4" />
      <span>Hướng dẫn</span>
    </Button>
  )
}
