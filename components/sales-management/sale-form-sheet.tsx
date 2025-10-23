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
import { Plus, Edit, Minus, ShoppingCart, X } from "lucide-react"
import { Sale, SaleDTO, SaleItem } from "@/lib/sales"
import { Item } from "@/lib/items"
import { CustomerDTO } from "@/lib/customers"
import { Discount } from "@/lib/discounts"
import { useToast } from "@/hooks/use-toast"
import { itemsApi } from "@/lib/items"
import { CustomerApi } from "@/lib/customers"
import { discountsApi } from "@/lib/discounts"
import { membershipsApi, membershipDiscountApi } from "@/lib/memberships"

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
    note: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [customers, setCustomers] = useState<CustomerDTO[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [membershipDiscount, setMembershipDiscount] = useState<Discount | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [discountType, setDiscountType] = useState<'none' | 'membership' | 'manual'>('none')
  
  const { toast } = useToast()

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, customersData, discountsData] = await Promise.all([
          itemsApi.getAll(),
          CustomerApi.list(),
          discountsApi.getAll()
        ])
        setItems(itemsData)
        setCustomers(customersData)
        setDiscounts(discountsData)
        setFilteredItems(itemsData)
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
          variant: "destructive",
        })
      }
    }
    loadData()
  }, [toast])

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = items.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCategory?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(items)
    }
  }, [searchTerm, items])

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
        note: sale.note || ''
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
        note: ''
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
        note: ''
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
        items: [...prev.items, { saleId: 0, itemId: item.itemId, quantity: 1 }]
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
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Customer Selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Khách hàng</Label>
            <Select 
              value={formData.customerId.toString()} 
              onValueChange={(value) => {
                const customerId = parseInt(value)
                setFormData(prev => ({ ...prev, customerId }))
                const customer = customers.find(c => c.customerId === customerId)
                setSelectedCustomer(customer || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.customerId} value={customer.customerId.toString()}>
                    {customer.customerName} - {customer.phoneNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCustomer && (
              <div className="text-sm text-muted-foreground">
                Thẻ thành viên: {selectedCustomer.membershipCardId ? `#${selectedCustomer.membershipCardId}` : 'Không có'}
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
              <div className="w-64">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                  value={selectedDiscount?.discountId.toString() || ""} 
                  onValueChange={(value) => {
                    if (value) {
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
                    <SelectItem value="">Không chọn</SelectItem>
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
                <span>{formatCurrency(formData.totalAmount)}</span>
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
