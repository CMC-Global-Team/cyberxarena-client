"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, User, Monitor, Calendar, DollarSign, AlertTriangle, Edit, Trash2, Power, RefreshCw } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface SessionActionsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: {
    id: number
    customerName: string
    customerPhone?: string
    customerBalance?: number
    membershipCardName?: string
    hasAccount?: boolean
    accountUsername?: string
    computerName: string
    status: string
  } | null
  onEdit: () => void
  onDelete: () => void
  onEndSession: () => void
  onChangeComputer: () => void
}

export function SessionActionsSheet({
  open,
  onOpenChange,
  session,
  onEdit,
  onDelete,
  onEndSession,
  onChangeComputer,
}: SessionActionsSheetProps) {
  if (!session) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "ACTIVE":
        return "bg-green-500/20 text-green-600 border-green-200"
      case "Ended":
      case "ENDED":
        return "bg-blue-500/20 text-blue-600 border-blue-200"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "Đang hoạt động"
      case "Ended":
        return "Đã kết thúc"
      case "ACTIVE":
        return "Đang hoạt động"
      case "ENDED":
        return "Đã kết thúc"
      default:
        return "Không xác định"
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quản lý phiên sử dụng
          </SheetTitle>
          <SheetDescription>
            Thông tin chi tiết và các thao tác cho phiên #{session.id}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Session Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Thông tin phiên</h3>
              <Badge className={getStatusColor(session.status)}>
                {getStatusText(session.status)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Khách hàng</p>
                  <p className="text-sm text-foreground font-medium">{session.customerName}</p>
                  {session.customerPhone && (
                    <p className="text-xs text-muted-foreground">📞 {session.customerPhone}</p>
                  )}
                  {session.membershipCardName && (
                    <p className="text-xs text-muted-foreground">🎫 {session.membershipCardName}</p>
                  )}
                  {session.hasAccount && session.accountUsername && (
                    <p className="text-xs text-muted-foreground">👤 @{session.accountUsername}</p>
                  )}
                  {session.customerBalance !== undefined && (
                    <p className="text-xs text-muted-foreground">💰 {session.customerBalance.toLocaleString('vi-VN')}đ</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Máy tính</p>
                  <p className="text-sm text-muted-foreground">{session.computerName}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thao tác</h3>
            
            <div className="space-y-3">
              {session.status === "Active" && (
                <>
                  <Button
                    onClick={onEndSession}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Kết thúc phiên
                  </Button>
                  
                  <Button
                    onClick={onChangeComputer}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đổi máy tính
                  </Button>
                </>
              )}

              <Button
                onClick={onEdit}
                className="w-full justify-start"
                variant="outline"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa thông tin
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa phiên
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Xác nhận xóa phiên
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn có chắc chắn muốn xóa phiên sử dụng này không? Hành động này không thể hoàn tác.
                      {session.status === "Active" && (
                        <span className="block mt-2 text-destructive font-medium">
                          ⚠️ Phiên đang hoạt động sẽ bị dừng ngay lập tức.
                        </span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Xóa phiên
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Separator />

          {/* Warning for active sessions */}
          {session.status === "Active" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Phiên đang hoạt động</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Phiên này đang được sử dụng. Hãy cẩn thận khi thực hiện các thao tác.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
