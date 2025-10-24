"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Revenue } from "@/lib/revenue"
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

interface RevenueChartProps {
  revenues: Revenue[]
  loading: boolean
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function RevenueChart({ revenues, loading }: RevenueChartProps) {
  const [activeTab, setActiveTab] = useState("line")

  // Prepare data for charts
  const chartData = revenues.map(revenue => ({
    date: new Date(revenue.date).toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric' 
    }),
    fullDate: revenue.date,
    computerUsage: Number(revenue.computerUsageRevenue || 0),
    sales: Number(revenue.salesRevenue || 0),
    total: Number(revenue.totalRevenue || 0)
  }))

  // Calculate totals for pie chart
  const totalComputerUsage = revenues.reduce((sum, r) => sum + Number(r.computerUsageRevenue || 0), 0)
  const totalSales = revenues.reduce((sum, r) => sum + Number(r.salesRevenue || 0), 0)
  
  const pieData = [
    { name: 'Sử dụng máy tính', value: totalComputerUsage, color: COLORS[0] },
    { name: 'Bán hàng', value: totalSales, color: COLORS[1] }
  ]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (revenues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>Chưa có dữ liệu để hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            <p>Vui lòng tạo báo cáo doanh thu để xem biểu đồ</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
        <CardDescription>Phân tích xu hướng doanh thu theo thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="line">Đường</TabsTrigger>
            <TabsTrigger value="bar">Cột</TabsTrigger>
            <TabsTrigger value="pie">Tròn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="line" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(Number(value)),
                      name === 'computerUsage' ? 'Sử dụng máy tính' : 
                      name === 'sales' ? 'Bán hàng' : 'Tổng doanh thu'
                    ]}
                    labelFormatter={(label) => `Ngày: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="computerUsage" 
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    name="Sử dụng máy tính"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke={COLORS[1]} 
                    strokeWidth={2}
                    name="Bán hàng"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={COLORS[2]} 
                    strokeWidth={3}
                    name="Tổng doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(Number(value)),
                      name === 'computerUsage' ? 'Sử dụng máy tính' : 
                      name === 'sales' ? 'Bán hàng' : 'Tổng doanh thu'
                    ]}
                    labelFormatter={(label) => `Ngày: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="computerUsage" fill={COLORS[0]} name="Sử dụng máy tính" />
                  <Bar dataKey="sales" fill={COLORS[1]} name="Bán hàng" />
                  <Bar dataKey="total" fill={COLORS[2]} name="Tổng doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="pie" className="mt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(Number(value)),
                      'Doanh thu'
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
