"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, DollarSign, User, ArrowUpDown } from "lucide-react"
import { RechargeHistoryApi, type RechargeHistoryDTO } from "@/lib/recharge-history"
import { useNotice } from "@/components/notice-provider"
import { usePageLoading } from "@/hooks/use-page-loading"

interface RechargeHistoryTableProps {
  customerId: number
  customerName: string
}

export function RechargeHistoryTable({ customerId, customerName }: RechargeHistoryTableProps) {
  const { notify } = useNotice()
  const { withPageLoading } = usePageLoading()
  const [rechargeHistory, setRechargeHistory] = useState<RechargeHistoryDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("rechargeDate")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 10

  const loadRechargeHistory = async () => {
    try {
      setLoading(true)
      const response = await withPageLoading(() => 
        RechargeHistoryApi.getByCustomerIdPaged(customerId, {
          page: currentPage,
          size: pageSize,
          sortBy,
          sortDir
        })
      )
      setRechargeHistory(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (e: any) {
      notify({ type: "error", message: `Lỗi tải lịch sử nạp tiền: ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRechargeHistory()
  }, [customerId, currentPage, sortBy, sortDir])

  const filteredHistory = useMemo(() => {
    return rechargeHistory.filter((history) => {
      const matchesSearch = 
        history.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        history.amount.toString().includes(searchQuery) ||
        new Date(history.rechargeDate).toLocaleDateString('vi-VN').includes(searchQuery)
      return matchesSearch
    })
  }, [rechargeHistory, searchQuery])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="h-8 w-8 p-0"
        >
          {i + 1}
        </Button>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
          className="h-8"
        >
          Đầu
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="h-8"
        >
          Trước
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="h-8"
        >
          Sau
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="h-8"
        >
          Cuối
        </Button>
      </div>
    )
  }

  return (
    <Card className="border-border bg-card h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Lịch sử nạp tiền</h3>
            <p className="text-sm text-muted-foreground">
              {customerName} - Tổng cộng: {totalElements} giao dịch
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, số tiền hoặc ngày..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="w-[180px]">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rechargeDate">Ngày nạp</SelectItem>
                <SelectItem value="amount">Số tiền</SelectItem>
                <SelectItem value="customerName">Tên khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[140px]">
            <Select value={sortDir} onValueChange={(v) => setSortDir(v as "asc" | "desc")}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('rechargeDate')}
                    className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Ngày nạp
                    <ArrowUpDown className="h-3 w-3 ml-2" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('amount')}
                    className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Số tiền
                    <ArrowUpDown className="h-3 w-3 ml-2" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('customerName')}
                    className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Khách hàng
                    <ArrowUpDown className="h-3 w-3 ml-2" />
                  </Button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  ID giao dịch
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((history) => (
                <tr key={history.rechargeId} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(history.rechargeDate)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      {formatCurrency(history.amount)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {history.customerName}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      #{history.rechargeId}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHistory.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Không có lịch sử nạp tiền nào</p>
          </div>
        )}
        
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 flex-shrink-0">
            <div className="text-sm text-muted-foreground">
              Hiển thị {currentPage * pageSize + 1} - {Math.min((currentPage + 1) * pageSize, totalElements)} trong tổng số {totalElements} giao dịch
            </div>
            {renderPagination()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
