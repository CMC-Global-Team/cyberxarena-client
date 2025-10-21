"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  isCollapsed?: boolean
}

export function ThemeToggle({ className, isCollapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent",
          isCollapsed && "mx-auto",
          className
        )}
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "h-8 w-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent",
        isCollapsed && "mx-auto",
        className
      )}
      title={theme === "light" ? "Chuyển sang chế độ tối" : "Chuyển sang chế độ sáng"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  )
}
