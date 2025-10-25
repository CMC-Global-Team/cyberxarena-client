"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ComputerApi, type ComputerDTO } from "@/lib/computers"
import { useToast } from "@/components/ui/use-toast"
import { useNotice } from "@/components/notice-provider"
import { useLoading } from "@/components/loading-provider"
import { 
  validateComputerName, 
  validateIPAddress, 
  validateIPAddressUniqueness,
  validateSpecification, 
  validatePricePerHour,
  formatNumber,
  parseFormattedNumber,
  type ValidationResult 
} from "@/lib/validation"

interface ComputerFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  computer?: ComputerDTO
  mode: "add" | "edit"
  onSaved?: (computer?: ComputerDTO) => void
  existingComputers?: Array<{ ipAddress?: string; computerId?: number }>
}

export function ComputerFormSheet({ open, onOpenChange, computer, mode, onSaved, existingComputers = [] }: ComputerFormSheetProps) {
  const { toast } = useToast()
  const { withLoading } = useLoading()
  const { notify } = useNotice()
  const [formData, setFormData] = useState({
    name: computer?.computerName || "",
    ipAddress: computer?.ipAddress || "",
    cpu: String(computer?.specifications?.cpu ?? ""),
    ram: String(computer?.specifications?.ram ?? ""),
    gpu: String(computer?.specifications?.gpu ?? ""),
    status: (computer?.status as string) || "Available",
    hourlyRate: computer ? String(computer.pricePerHour) : "15000",
  })
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [displayPrice, setDisplayPrice] = useState("")

  // Sync form when the selected computer changes or when sheet opens
  useEffect(() => {
    if (!open) return
    const price = computer ? computer.pricePerHour : 15000
    setFormData({
      name: computer?.computerName || "",
      ipAddress: computer?.ipAddress || "",
      cpu: String(computer?.specifications?.cpu ?? ""),
      ram: String(computer?.specifications?.ram ?? ""),
      gpu: String(computer?.specifications?.gpu ?? ""),
      status: (computer?.status as string) || "Available",
      hourlyRate: String(price),
    })
    setDisplayPrice(formatNumber(price))
    setValidationErrors({})
  }, [computer, mode, open])

  // Real-time validation handlers
  const handleNameChange = (value: string) => {
    setFormData({ ...formData, name: value })
    
    const validation = validateComputerName(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, name: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, name: '' }))
    }
  }

  const handleIPChange = (value: string) => {
    setFormData({ ...formData, ipAddress: value })
    
    // Validate IP format
    const validation = validateIPAddress(value)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, ipAddress: validation.message! }))
    } else {
      // Check uniqueness if IP format is valid
      const uniquenessValidation = validateIPAddressUniqueness(value, existingComputers, computer?.computerId)
      if (!uniquenessValidation.isValid && uniquenessValidation.message) {
        setValidationErrors(prev => ({ ...prev, ipAddress: uniquenessValidation.message! }))
      } else {
        setValidationErrors(prev => ({ ...prev, ipAddress: '' }))
      }
    }
  }

  const handleSpecChange = (value: string, field: 'cpu' | 'ram' | 'gpu') => {
    setFormData({ ...formData, [field]: value })
    
    const fieldName = field.toUpperCase()
    const validation = validateSpecification(value, fieldName)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, [field]: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePriceChange = (value: string) => {
    // Remove all non-digit characters to get clean number
    const cleanValue = value.replace(/[^\d]/g, '')
    const numericValue = parseFloat(cleanValue) || 0
    
    setFormData({ ...formData, hourlyRate: String(numericValue) })
    
    // Auto-format with commas if there's a value
    if (numericValue > 0) {
      setDisplayPrice(formatNumber(numericValue))
    } else {
      setDisplayPrice(cleanValue) // Show what user is typing
    }
    
    const validation = validatePricePerHour(numericValue)
    if (!validation.isValid && validation.message) {
      setValidationErrors(prev => ({ ...prev, hourlyRate: validation.message! }))
    } else {
      setValidationErrors(prev => ({ ...prev, hourlyRate: '' }))
    }
  }

  const validateFormData = (): boolean => {
    const validations = {
      name: validateComputerName(formData.name),
      ipAddress: validateIPAddress(formData.ipAddress),
      cpu: validateSpecification(formData.cpu, 'CPU'),
      ram: validateSpecification(formData.ram, 'RAM'),
      gpu: validateSpecification(formData.gpu, 'GPU'),
      hourlyRate: validatePricePerHour(Number(formData.hourlyRate))
    }

    // Check IP uniqueness
    const ipUniqueness = validateIPAddressUniqueness(formData.ipAddress, existingComputers, computer?.computerId)

    let isValid = true
    const errorMap: {[key: string]: string} = {}
    
    Object.entries(validations).forEach(([field, result]) => {
      if (!result.isValid && result.message) {
        errorMap[field] = result.message
        isValid = false
      }
    })

    // Add IP uniqueness error
    if (!ipUniqueness.isValid && ipUniqueness.message) {
      errorMap.ipAddress = ipUniqueness.message
      isValid = false
    }
    
    setValidationErrors(errorMap)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateFormData()) {
      return
    }

    const dto: Omit<ComputerDTO, "computerId"> = {
      computerName: formData.name,
      ipAddress: formData.ipAddress,
      pricePerHour: Number(formData.hourlyRate),
      status: formData.status === "In Use" ? "In_Use" : formData.status,
      specifications: {
        cpu: formData.cpu,
        ram: formData.ram,
        gpu: formData.gpu,
      },
    }
    try {
      if (mode === "add") {
        const created = await withLoading(() => ComputerApi.create(dto))
        onSaved?.(created)
        notify({ type: "success", message: "Đã thêm máy tính" })
      } else if (mode === "edit" && computer?.computerId) {
        const updated = await withLoading(() => ComputerApi.update(computer.computerId, dto))
        onSaved?.(updated)
        notify({ type: "success", message: "Đã cập nhật máy tính" })
      }
      onOpenChange(false)
    } catch (err: any) {
      notify({ type: "error", message: `Lưu thất bại: ${err?.message || ''}` })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            {mode === "add" ? "Thêm máy tính mới" : "Chỉnh sửa máy tính"}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {mode === "add" ? "Nhập thông tin máy tính mới vào hệ thống" : "Cập nhật thông tin máy tính"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Tên máy tính
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Máy tính 01"
              className={`bg-secondary border-border ${validationErrors.name ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.name && (
              <p className="text-xs text-red-500">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipAddress" className="text-foreground">
              Địa chỉ IP
            </Label>
            <Input
              id="ipAddress"
              value={formData.ipAddress}
              onChange={(e) => handleIPChange(e.target.value)}
              placeholder="192.168.1.101"
              className={`bg-secondary border-border ${validationErrors.ipAddress ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.ipAddress && (
              <p className="text-xs text-red-500">{validationErrors.ipAddress}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpu" className="text-foreground">
              CPU
            </Label>
            <Input
              id="cpu"
              value={formData.cpu}
              onChange={(e) => handleSpecChange(e.target.value, 'cpu')}
              placeholder="Intel i5-12400F"
              className={`bg-secondary border-border ${validationErrors.cpu ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.cpu && (
              <p className="text-xs text-red-500">{validationErrors.cpu}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ram" className="text-foreground">
              RAM
            </Label>
            <Input
              id="ram"
              value={formData.ram}
              onChange={(e) => handleSpecChange(e.target.value, 'ram')}
              placeholder="16GB DDR4"
              className={`bg-secondary border-border ${validationErrors.ram ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.ram && (
              <p className="text-xs text-red-500">{validationErrors.ram}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpu" className="text-foreground">
              GPU
            </Label>
            <Input
              id="gpu"
              value={formData.gpu}
              onChange={(e) => handleSpecChange(e.target.value, 'gpu')}
              placeholder="RTX 3060"
              className={`bg-secondary border-border ${validationErrors.gpu ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.gpu && (
              <p className="text-xs text-red-500">{validationErrors.gpu}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">
              Trạng thái
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Sẵn sàng</SelectItem>
                <SelectItem value="In Use">Đang sử dụng</SelectItem>
                <SelectItem value="Broken">Bảo trì</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate" className="text-foreground">
              Giá/giờ
            </Label>
            <Input
              id="hourlyRate"
              type="text"
              value={displayPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="15,000đ/h"
              className={`bg-secondary border-border ${validationErrors.hourlyRate ? 'border-red-500' : ''}`}
              required
            />
            {validationErrors.hourlyRate && (
              <p className="text-xs text-red-500">{validationErrors.hourlyRate}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              {mode === "add" ? "Thêm máy tính" : "Cập nhật"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
