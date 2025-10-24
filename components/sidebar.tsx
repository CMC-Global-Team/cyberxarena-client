"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Monitor, Clock, DollarSign, Settings, LogOut, ChevronLeft, ChevronRight, Package, Percent, IdCard, Moon, Sun, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Quản lý khách hàng",
    icon: Users,
    href: "/dashboard/customers",
  },
  {
    title: "Quản lý máy tính",
    icon: Monitor,
    href: "/dashboard/computers",
  },
  {
    title: "Quản lý sản phẩm",
    icon: Package,
    href: "/dashboard/products",
  },
  {
    title: "Bán hàng",
    icon: ShoppingCart,
    href: "/dashboard/sales",
  },
  {
    title: "Quản lý giảm giá",
    icon: Percent,
    href: "/dashboard/discounts",
  },
  {
    title: "Gói thành viên",
    icon: IdCard,
    href: "/dashboard/memberships",
  },
  {
    title: "Phiên sử dụng",
    icon: Clock,
    href: "/dashboard/sessions",
  },
  {
    title: "Quản lý doanh thu",
    icon: DollarSign,
    href: "/dashboard/revenue",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/dashboard/settings",
    disabled: true,
  },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { theme, setTheme } = useTheme()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <>
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!isCollapsed && <h2 className="text-lg font-bold text-sidebar-foreground font-mono">CyberX Arena</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  isCollapsed && "justify-center px-2",
                  item.disabled && "opacity-50 cursor-not-allowed",
                )}
                onClick={() => !item.disabled && router.push(item.href)}
                disabled={item.disabled}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            )
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-2",
            )}
            onClick={toggleTheme}
            title={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
          >
            {theme === "light" ? (
              <Moon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            ) : (
              <Sun className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            )}
            {!isCollapsed && <span>{theme === "light" ? "Chế độ tối" : "Chế độ sáng"}</span>}
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300",
              isCollapsed && "justify-center px-2",
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>Đăng xuất</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
