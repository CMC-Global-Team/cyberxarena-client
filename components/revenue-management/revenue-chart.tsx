"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"
import { Revenue } from "@/lib/revenue"
import * as d3 from "d3"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface RevenueChartProps {
  revenues: Revenue[];
  loading: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  showAnalytics?: boolean;
}

export function RevenueChart({ revenues, loading, dateRange, showAnalytics = false }: RevenueChartProps) {
  const lineChartRef = useRef<HTMLDivElement>(null)
  const barChartRef = useRef<HTMLDivElement>(null)
  const pieChartRef = useRef<HTMLDivElement>(null)
  const [activeChart, setActiveChart] = useState<"line" | "bar" | "pie">("line")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Line Chart
  useEffect(() => {
    if (!lineChartRef.current || loading || revenues.length === 0) {
      console.log("RevenueChart: Skipping line chart render", { 
        hasRef: !!lineChartRef.current, 
        loading, 
        revenuesLength: revenues.length 
      })
      return
    }

    console.log("RevenueChart: Rendering line chart with data", revenues)
    const svg = d3.select(lineChartRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const width = lineChartRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Sort revenues by date
    const sortedRevenues = [...revenues].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const x = d3.scaleTime()
      .domain(d3.extent(sortedRevenues, d => new Date(d.date)) as [Date, Date])
      .range([0, width])

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedRevenues, d => d.totalRevenue) || 0])
      .range([height, 0])

    // Line generator
    const line = d3.line<Revenue>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.totalRevenue))
      .curve(d3.curveMonotoneX)

    // Add line
    g.append("path")
      .datum(sortedRevenues)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add dots
    g.selectAll(".dot")
      .data(sortedRevenues)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.totalRevenue))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%d/%m")))

    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d => formatCurrency(d as number)))

    // Add grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat(() => ""))

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => ""))

    // Style grid lines
    svg.selectAll(".grid line")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-opacity", 0.3)

  }, [revenues, loading])

  // Bar Chart
  useEffect(() => {
    if (!barChartRef.current || loading || revenues.length === 0) return

    const svg = d3.select(barChartRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const width = barChartRef.current.clientWidth - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Sort revenues by date
    const sortedRevenues = [...revenues].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const x = d3.scaleBand()
      .domain(sortedRevenues.map(d => format(new Date(d.date), 'dd/MM')))
      .range([0, width])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedRevenues, d => d.totalRevenue) || 0])
      .range([height, 0])

    // Add bars
    g.selectAll(".bar")
      .data(sortedRevenues)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(format(new Date(d.date), 'dd/MM')) || 0)
      .attr("y", d => y(d.totalRevenue))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.totalRevenue))
      .attr("fill", "#3b82f6")
      .attr("opacity", 0.8)

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))

    g.append("g")
      .call(d3.axisLeft(y).tickFormat(d => formatCurrency(d as number)))

  }, [revenues, loading])

  // Pie Chart
  useEffect(() => {
    if (!pieChartRef.current || loading || revenues.length === 0) return

    const svg = d3.select(pieChartRef.current)
    svg.selectAll("*").remove()

    const width = pieChartRef.current.clientWidth
    const height = 300
    const radius = Math.min(width, height) / 2 - 20

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Calculate totals
    const totalComputerUsage = revenues.reduce((sum, r) => sum + r.computerUsageRevenue, 0)
    const totalSales = revenues.reduce((sum, r) => sum + r.salesRevenue, 0)

    const data = [
      { label: "Sử dụng máy", value: totalComputerUsage, color: "#3b82f6" },
      { label: "Bán hàng", value: totalSales, color: "#10b981" }
    ]

    const pie = d3.pie<{ label: string; value: number; color: string }>()
      .value(d => d.value)

    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(0)
      .outerRadius(radius)

    const arcs = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc")

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .attr("opacity", 0.8)

    // Add labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "white")
      .text(d => `${d.data.label}: ${formatCurrency(d.data.value)}`)

  }, [revenues, loading])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>Đang tải dữ liệu...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (revenues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
          <CardDescription>Không có dữ liệu để hiển thị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <p>Không có dữ liệu doanh thu</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu</CardTitle>
        <CardDescription>
          Phân tích doanh thu từ {format(new Date(dateRange.startDate), 'dd/MM/yyyy', { locale: vi })} đến {format(new Date(dateRange.endDate), 'dd/MM/yyyy', { locale: vi })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as "line" | "bar" | "pie")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="line" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Đường</span>
            </TabsTrigger>
            <TabsTrigger value="bar" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Cột</span>
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Tròn</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="mt-4">
            <div ref={lineChartRef} className="w-full"></div>
          </TabsContent>

          <TabsContent value="bar" className="mt-4">
            <div ref={barChartRef} className="w-full"></div>
          </TabsContent>

          <TabsContent value="pie" className="mt-4">
            <div ref={pieChartRef} className="w-full"></div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
