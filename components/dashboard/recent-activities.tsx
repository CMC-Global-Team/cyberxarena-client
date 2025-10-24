"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecentActivity } from "@/lib/dashboard"

interface RecentActivitiesProps {
  activities: RecentActivity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.computerName}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Không có hoạt động gần đây</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
