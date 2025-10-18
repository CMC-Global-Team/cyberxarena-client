"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Monitor, DollarSign, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
    title: "Quản lý doanh thu",
    icon: DollarSign,
    href: "/dashboard/revenue",
    disabled: true,
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

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
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

        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
