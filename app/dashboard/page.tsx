import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Users, DollarSign, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng máy",
      value: "50",
      description: "45 đang hoạt động",
      icon: Monitor,
      trend: "+2 từ hôm qua",
    },
    {
      title: "Khách hàng",
      value: "1,234",
      description: "38 đang online",
      icon: Users,
      trend: "+12% so với tuần trước",
    },
    {
      title: "Doanh thu hôm nay",
      value: "2,450,000đ",
      description: "Từ 45 giao dịch",
      icon: DollarSign,
      trend: "+8% so với hôm qua",
    },
    {
      title: "Thời gian trung bình",
      value: "3.5h",
      description: "Mỗi phiên chơi",
      icon: Clock,
      trend: "+0.5h so với tuần trước",
    },
  ]

  const recentActivities = [
    { id: 1, user: "Máy #12", action: "Khách hàng đăng nhập", time: "2 phút trước" },
    { id: 2, user: "Máy #05", action: "Khách hàng đăng xuất", time: "5 phút trước" },
    { id: 3, user: "Máy #23", action: "Nạp thêm thời gian", time: "8 phút trước" },
    { id: 4, user: "Máy #18", action: "Khách hàng đăng nhập", time: "12 phút trước" },
    { id: 5, user: "Máy #07", action: "Khách hàng đăng xuất", time: "15 phút trước" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống CyberX Arena</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <div className="flex items-center mt-2 text-xs text-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Trạng thái máy</CardTitle>
            <CardDescription>Tình trạng hoạt động của các máy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-primary" />
                  <span className="text-sm text-foreground">Đang sử dụng</span>
                </div>
                <span className="text-sm font-medium text-foreground">45 máy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-muted" />
                  <span className="text-sm text-foreground">Trống</span>
                </div>
                <span className="text-sm font-medium text-foreground">5 máy</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-destructive" />
                  <span className="text-sm text-foreground">Bảo trì</span>
                </div>
                <span className="text-sm font-medium text-foreground">0 máy</span>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Tỷ lệ sử dụng</span>
                  <span className="text-sm font-medium text-foreground">90%</span>
                </div>
                <div className="h-2 bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
