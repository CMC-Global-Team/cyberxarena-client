"use client"

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface LoginTourProps {
  isVisible: boolean
  onComplete?: () => void
}

export function LoginTour({ isVisible, onComplete }: LoginTourProps) {
  useEffect(() => {
    if (!isVisible) return

    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Tiếp theo',
      prevBtnText: 'Trước đó',
      doneBtnText: 'Hoàn thành',
      progressText: 'Bước {{current}} của {{total}}',
      steps: [
        {
          element: '#username',
          popover: {
            title: 'Bước 1: Nhập tên đăng nhập',
            description: 'Nhập "admin" vào ô tên đăng nhập',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: '#password',
          popover: {
            title: 'Bước 2: Nhập mật khẩu',
            description: 'Nhập "admin" vào ô mật khẩu',
            side: "bottom",
            align: 'start'
          }
        },
        {
          element: 'button[type="submit"]',
          popover: {
            title: 'Bước 3: Đăng nhập',
            description: 'Nhấn nút "Đăng nhập" để hoàn tất quá trình đăng nhập',
            side: "top",
            align: 'center'
          }
        }
      ],
      onDestroyed: () => {
        onComplete?.()
      }
    })

    driverObj.drive()

    return () => {
      driverObj.destroy()
    }
  }, [isVisible, onComplete])

  return null
}
