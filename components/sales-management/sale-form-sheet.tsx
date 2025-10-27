"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Spinner } from "@/components/ui/spinner"
import { Plus, Edit, Minus, ShoppingCart, X, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Sale, SaleDTO, SaleItem } from "@/lib/sales"
import { Item } from "@/lib/items"
import { CustomerDTO } from "@/lib/customers"
import { Discount } from "@/lib/discounts"
import { useToast } from "@/hooks/use-toast"
import { itemsApi } from "@/lib/items"
import { CustomerApi } from "@/lib/customers"
import { discountsApi } from "@/lib/discounts"
import { membershipsApi, membershipDiscountApi } from "@/lib/memberships"
import { cn } from "@/lib/utils"

interface SaleFormSheetProps {
  sale?: Sale
  mode: "add" | "edit"
  onSuccess: (data: SaleDTO) => void
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SaleFormSheet({ sale, mode, onSuccess, children, open: controlledOpen, onOpenChange }: SaleFormSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  const [formData, setFormData] = useState<SaleDTO>({
    customerId: 0,
    saleDate: new Date().toISOString(),
    items: [],
    paymentMethod: 'Cash',
    totalAmount: 0,
    discountId: undefined,
    note: '',
    status: 'Paid'
  })
  
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [membershipDiscount, setMembershipDiscount] = useState<Discount | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [discountType, setDiscountType] = useState<'none' | 'membership' | 'manual'>('none')
  const [isLoadingData, setIsLoadingData] = useState(false)
  
  // Customer search and pagination
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDTO[]>([])
  const [customerPage, setCustomerPage] = useState(0)
  const [customerTotalPages, setCustomerTotalPages] = useState(1)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  
  const { toast } = useToast()

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true)
      try {
        const [itemsData, discountsData] = await Promise.all([
          itemsApi.getAll(),
          discountsApi.getAll()
        ])
        setItems(itemsData)
        setDiscounts(discountsData)
        setFilteredItems(itemsData)
        
        // Load first page of customers
        await loadCustomers(0)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }
    loadData()
  }, [toast])

  // Load customers with pagination
  const loadCustomers = async (page: number) => {
    try {
      const response = await CustomerApi.list({ page, size: 20 })
      console.log("Sale - Customer API response:", response)
      console.log("Sale - Response type:", typeof response, "Is array:", Array.isArray(response))
      
      // Handle both array response and PageResponse
      let customersData: CustomerDTO[] = []
      let totalPages = 1
      
      if (Array.isArray(response)) {
        customersData = response
        console.log("Sale - Response is array with", customersData.length, "items")
        totalPages = 1 // Single page for array response
      } else if (response && typeof response === 'object' && 'content' in response) {
        customersData = response.content || []
        totalPages = response.totalPages || 1
        console.log("Sale - Response is PageResponse with", customersData.length, "items, total pages:", totalPages)
      }
      
      console.log("Sale - Setting customers to:", customersData.length, "items")
      setCustomers(customersData)
      setCustomerTotalPages(totalPages)
      setCustomerPage(page)
    } catch (error) {
      console.error("Sale - Error loading customers:", error)
    }
  }

  // Filter customers based on search term
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.phoneNumber?.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [customerSearchTerm, customers])

  // Filter items based on search term and category
  useEffect(() => {
    let filtered = items

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.itemCategory === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory, items])

  // Initialize form data
  useEffect(() => {
    if (sale && mode === "edit") {
      setFormData({
        customerId: sale.customerId,
        saleDate: sale.saleDate,
        items: sale.items,
        paymentMethod: sale.paymentMethod,
        totalAmount: sale.totalAmount,
        discountId: sale.discountId,
        note: sale.note || '',
        status: sale.status
      })
      
      // Find and set selected customer
      const customer = customers.find(c => c.customerId === sale.customerId)
      if (customer) setSelectedCustomer(customer)
      
      // Find and set selected discount
      if (sale.discountId) {
        const discount = discounts.find(d => d.discountId === sale.discountId)
        if (discount) setSelectedDiscount(discount)
      }
    } else {
      setFormData({
        customerId: 0,
        saleDate: new Date().toISOString(),
        items: [],
        paymentMethod: 'Cash',
        totalAmount: 0,
        discountId: undefined,
        note: '',
        status: 'Paid'
      })
      setSelectedCustomer(null)
      setSelectedDiscount(null)
      setMembershipDiscount(null)
      setDiscountType('none')
    }
  }, [sale, mode, customers, discounts])

  // Load membership discount when customer changes
  useEffect(() => {
    const loadMembershipDiscount = async () => {
      if (selectedCustomer && selectedCustomer.membershipCardId) {
        try {
          const membershipCard = await membershipsApi.getById(selectedCustomer.membershipCardId)
          if (membershipCard.discountId) {
            const discount = discounts.find(d => d.discountId === membershipCard.discountId)
            if (discount) {
              setMembershipDiscount(discount)
              if (discountType === 'membership') {
                setSelectedDiscount(discount)
                setFormData(prev => ({ ...prev, discountId: discount.discountId }))
              }
            }
          } else {
            setMembershipDiscount(null)
          }
        } catch (error) {
          console.error('Error loading membership discount:', error)
          setMembershipDiscount(null)
        }
      } else {
        setMembershipDiscount(null)
      }
    }
    
    loadMembershipDiscount()
  }, [selectedCustomer, discounts, discountType])

  // Calculate total amount
  useEffect(() => {
    const subtotal = formData.items.reduce((total, item) => {
      const product = items.find(p => p.itemId === item.itemId)
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
    
    let discountAmount = 0
    if (discountType === 'membership' && membershipDiscount) {
      if (membershipDiscount.discountType === 'Percentage') {
        discountAmount = subtotal * (membershipDiscount.discountValue / 100)
      } else {
        discountAmount = membershipDiscount.discountValue
      }
    } else if (discountType === 'manual' && selectedDiscount) {
      if (selectedDiscount.discountType === 'Percentage') {
        discountAmount = subtotal * (selectedDiscount.discountValue / 100)
      } else {
        discountAmount = selectedDiscount.discountValue
      }
    }
    
    const finalTotal = Math.max(0, subtotal - discountAmount)
    setFormData(prev => ({ ...prev, totalAmount: finalTotal }))
  }, [formData.items, selectedDiscount, membershipDiscount, discountType, items])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.customerId === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn khách hàng",
        variant: "destructive",
      })
      return
    }
    
    if (formData.items.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng thêm ít nhất một sản phẩm",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await onSuccess(formData)
      setOpen(false)
      setFormData({
        customerId: 0,
        saleDate: new Date().toISOString(),
        items: [],
        paymentMethod: 'Cash',
        totalAmount: 0,
        discountId: undefined,
        note: '',
        status: 'Paid'
      })
      setSelectedCustomer(null)
      setSelectedDiscount(null)
      setMembershipDiscount(null)
      setDiscountType('none')
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = (item: Item) => {
    const existingItem = formData.items.find(i => i.itemId === item.itemId)
    if (existingItem) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(i =>
          i.itemId === item.itemId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { saleId: 0, itemId: item.itemId, quantity: 1, saleDetailId: 0 }]
      }))
    }
  }

  const removeItem = (itemId: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(i => i.itemId !== itemId)
    }))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(i =>
        i.itemId === itemId ? { ...i, quantity } : i
      )
    }))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount || 0)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button>
            {mode === "add" ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Tạo hóa đơn mới
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa hóa đơn
              </>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:w-[1000px] max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === "add" ? "Tạo hóa đơn mới" : "Chỉnh sửa hóa đơn"}
          </SheetTitle>
          <SheetDescription>
            {mode === "add" 
              ? "Tạo hóa đơn bán hàng mới"
              : "Cập nhật thông tin hóa đơn"
            }
          </SheetDescription>
        </SheetHeader>

        {/* Loading Overlay */}
        {isLoadingData && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-8 w-8 text-primary" />
              <span className="text-sm text-muted-foreground font-medium">
                Đang tải dữ liệu...
              </span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={cn("space-y-6 mt-6", isLoadingData && "pointer-events-none opacity-50")}>
          {/* Customer Selection with Search and Pagination */}
          <div className="space-y-2">
            <Label htmlFor="customer">Khách hàng</Label>
            <Popover open={showCustomerDropdown} onOpenChange={setShowCustomerDropdown}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                  disabled={isLoadingData}
                >
                  {selectedCustomer 
                    ? `${selectedCustomer.customerName} - ${selectedCustomer.phoneNumber}`
                    : "Chọn khách hàng..."
                  }
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Tìm kiếm khách hàng..." 
                    value={customerSearchTerm}
                    onValueChange={setCustomerSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy khách hàng.</CommandEmpty>
                    <CommandGroup>
                      {filteredCustomers.slice(0, 10).map((customer) => (
                        <CommandItem
                          key={customer.customerId}
                          value={`${customer.customerName} ${customer.phoneNumber}`}
                          onSelect={() => {
                            setFormData(prev => ({ ...prev, customerId: customer.customerId }))
                            setSelectedCustomer(customer)
                            setShowCustomerDropdown(false)
                            setCustomerSearchTerm("")
                          }}
                        >
                          <div className="flex flex-col w-full">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{customer.customerName}</span>
                              <span className="text-xs text-muted-foreground">
                                ID: {customer.customerId}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {customer.phoneNumber} • Số dư: {customer.balance.toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                  {customerTotalPages > 1 && (
                    <div className="flex items-center justify-between p-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadCustomers(Math.max(0, customerPage - 1))}
                        disabled={customerPage === 0}
                      >
                        Trang trước
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Trang {customerPage + 1} / {customerTotalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadCustomers(Math.min(customerTotalPages - 1, customerPage + 1))}
                        disabled={customerPage >= customerTotalPages - 1}
                      >
                        Trang sau
                      </Button>
                    </div>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            {selectedCustomer && (
              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                <div className="font-medium">{selectedCustomer.customerName}</div>
                <div className="text-xs mt-1">
                  SĐT: {selectedCustomer.phoneNumber} • 
                  Thẻ thành viên: {selectedCustomer.membershipCardId ? `#${selectedCustomer.membershipCardId}` : 'Không có'} • 
                  Số dư: {selectedCustomer.balance.toLocaleString('vi-VN')}đ
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Phương thức thanh toán</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Tiền mặt</SelectItem>
                <SelectItem value="Card">Thẻ</SelectItem>
                <SelectItem value="Transfer">Chuyển khoản</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Sản phẩm</Label>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Array.from(new Set(items.map(item => item.itemCategory).filter(Boolean))).map(category => (
                      <SelectItem key={category} value={category!}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-64">
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Danh sách sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div key={item.itemId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.itemCategory} • {formatCurrency(item.price)} • Tồn: {item.stock}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addItem(item)}
                        disabled={item.stock === 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Items */}
          {formData.items.length > 0 && (
            <div className="space-y-2">
              <Label>Sản phẩm đã chọn</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {formData.items.map((item) => {
                      const product = items.find(p => p.itemId === item.itemId)
                      if (!product) return null
                      
                      return (
                        <div key={item.itemId} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="font-medium">{product.itemName}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(product.price)} × {item.quantity} = {formatCurrency(product.price * item.quantity)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                              disabled={item.quantity >= product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => removeItem(item.itemId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Discount Selection */}
          <div className="space-y-4">
            <Label>Giảm giá (tùy chọn)</Label>
            
            {/* Discount Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Loại giảm giá</Label>
              <Select 
                value={discountType} 
                onValueChange={(value: 'none' | 'membership' | 'manual') => {
                  setDiscountType(value)
                  if (value === 'none') {
                    setFormData(prev => ({ ...prev, discountId: undefined }))
                    setSelectedDiscount(null)
                  } else if (value === 'membership' && membershipDiscount) {
                    setSelectedDiscount(membershipDiscount)
                    setFormData(prev => ({ ...prev, discountId: membershipDiscount.discountId }))
                  } else if (value === 'manual') {
                    setSelectedDiscount(null)
                    setFormData(prev => ({ ...prev, discountId: undefined }))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại giảm giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không giảm giá</SelectItem>
                  <SelectItem value="membership" disabled={!membershipDiscount}>
                    Giảm giá thành viên {membershipDiscount ? `(${membershipDiscount.discountName})` : '(Không có)'}
                  </SelectItem>
                  <SelectItem value="manual">Giảm giá thủ công</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Manual Discount Selection */}
            {discountType === 'manual' && (
              <div className="space-y-2">
                <Label htmlFor="manualDiscount">Chọn giảm giá thủ công</Label>
                <Select 
                  value={selectedDiscount?.discountId.toString() || "none"} 
                  onValueChange={(value) => {
                    if (value && value !== "none") {
                      const discountId = parseInt(value)
                      setFormData(prev => ({ ...prev, discountId }))
                      const discount = discounts.find(d => d.discountId === discountId)
                      setSelectedDiscount(discount || null)
                    } else {
                      setFormData(prev => ({ ...prev, discountId: undefined }))
                      setSelectedDiscount(null)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giảm giá thủ công" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {discounts.map((discount) => (
                      <SelectItem key={discount.discountId} value={discount.discountId.toString()}>
                        {discount.discountName} - {discount.discountType === 'Percentage' ? `${discount.discountValue}%` : formatCurrency(discount.discountValue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Discount Info Display */}
            {(discountType === 'membership' && membershipDiscount) && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Giảm giá thành viên: {membershipDiscount.discountName}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  {membershipDiscount.discountType === 'Percentage' 
                    ? `${membershipDiscount.discountValue}%` 
                    : formatCurrency(membershipDiscount.discountValue)
                  }
                </div>
              </div>
            )}

            {discountType === 'manual' && selectedDiscount && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  Giảm giá thủ công: {selectedDiscount.discountName}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  {selectedDiscount.discountType === 'Percentage' 
                    ? `${selectedDiscount.discountValue}%` 
                    : formatCurrency(selectedDiscount.discountValue)
                  }
                </div>
              </div>
            )}

            {discountType === 'none' && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Không áp dụng giảm giá
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Nhập ghi chú (tùy chọn)"
              maxLength={200}
            />
          </div>

          {/* Total Amount Display */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(formData.totalAmount || 0)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : (mode === "add" ? "Tạo hóa đơn" : "Cập nhật")}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
