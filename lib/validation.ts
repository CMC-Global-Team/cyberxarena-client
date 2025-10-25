/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export interface FieldValidation {
  [key: string]: ValidationResult
}

// Phone number validation for Vietnamese format
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { isValid: true } // Phone is optional
  }

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Vietnamese phone number patterns
  const patterns = [
    /^0[3-9]\d{8}$/, // 0xxxxxxxxx (10 digits starting with 0)
    /^\+84[3-9]\d{8}$/, // +84xxxxxxxxx (12 digits starting with +84)
  ]

  const isValid = patterns.some(pattern => pattern.test(cleaned))
  
  if (!isValid) {
    return {
      isValid: false,
      message: 'Số điện thoại không hợp lệ. Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx'
    }
  }

  return { isValid: true }
}

// Name validation
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Họ và tên không được để trống'
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Họ và tên phải có ít nhất 2 ký tự'
    }
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      message: 'Họ và tên không được vượt quá 100 ký tự'
    }
  }

  // Check for valid characters (letters, spaces, Vietnamese characters, and common punctuation)
  // Updated regex to include all Vietnamese diacritics
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơẠẢÃẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỳỵỷỹạảãầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữự\s\-'\.]+$/
  if (!namePattern.test(name.trim())) {
    return {
      isValid: false,
      message: 'Họ và tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang, dấu nháy đơn và dấu chấm'
    }
  }

  return { isValid: true }
}

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      message: 'Tên đăng nhập không được để trống'
    }
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
    }
  }

  if (username.length > 50) {
    return {
      isValid: false,
      message: 'Tên đăng nhập không được vượt quá 50 ký tự'
    }
  }

  // Only allow letters, numbers, and underscores
  const usernamePattern = /^[a-zA-Z0-9_]+$/
  if (!usernamePattern.test(username)) {
    return {
      isValid: false,
      message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
    }
  }

  return { isValid: true }
}

// Password validation
export const validatePassword = (password: string, isRequired: boolean = true): ValidationResult => {
  if (!password || password.trim() === '') {
    if (isRequired) {
      return {
        isValid: false,
        message: 'Mật khẩu không được để trống'
      }
    }
    return { isValid: true } // Empty password is OK if not required
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  }

  if (password.length > 255) {
    return {
      isValid: false,
      message: 'Mật khẩu không được vượt quá 255 ký tự'
    }
  }

  return { isValid: true }
}

// Balance validation
export const validateBalance = (balance: number): ValidationResult => {
  if (balance < 0) {
    return {
      isValid: false,
      message: 'Số dư không được âm'
    }
  }

  if (balance > 999999999) {
    return {
      isValid: false,
      message: 'Số dư không được vượt quá 999,999,999 VND'
    }
  }

  return { isValid: true }
}

// Amount validation for recharge
export const validateRechargeAmount = (amount: number): ValidationResult => {
  if (amount < 1000) {
    return {
      isValid: false,
      message: 'Số tiền nạp tối thiểu là 1,000 VND'
    }
  }

  if (amount > 10000000) {
    return {
      isValid: false,
      message: 'Số tiền nạp không được vượt quá 10,000,000 VND'
    }
  }

  return { isValid: true }
}

// Membership card validation
export const validateMembershipCard = (cardId: number): ValidationResult => {
  if (cardId < 0) {
    return {
      isValid: false,
      message: 'ID thẻ thành viên không hợp lệ'
    }
  }

  return { isValid: true }
}

// Form validation helper
export const validateForm = (validations: FieldValidation): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  let isValid = true

  Object.entries(validations).forEach(([field, result]) => {
    if (!result.isValid && result.message) {
      errors.push(result.message)
      isValid = false
    }
  })

  return { isValid, errors }
}

// Currency formatting utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export const parseFormattedNumber = (formattedValue: string): number => {
  // Remove all non-digit characters except decimal point
  const cleaned = formattedValue.replace(/[^\d.]/g, '')
  return parseFloat(cleaned) || 0
}

// Computer name validation
export const validateComputerName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Tên máy tính không được để trống'
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Tên máy tính phải có ít nhất 2 ký tự'
    }
  }

  if (name.trim().length > 50) {
    return {
      isValid: false,
      message: 'Tên máy tính không được vượt quá 50 ký tự'
    }
  }

  // Allow letters (including Vietnamese), numbers, spaces, and common computer naming characters
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơẠẢÃẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỳỵỷỹạảãầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữự0-9\s\-_\.]+$/
  if (!namePattern.test(name.trim())) {
    return {
      isValid: false,
      message: 'Tên máy tính chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch ngang, gạch dưới và dấu chấm'
    }
  }

  return { isValid: true }
}

// IP address validation
export const validateIPAddress = (ip: string): ValidationResult => {
  if (!ip || ip.trim() === '') {
    return {
      isValid: false,
      message: 'Địa chỉ IP không được để trống'
    }
  }

  // IPv4 pattern
  const ipPattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  if (!ipPattern.test(ip.trim())) {
    return {
      isValid: false,
      message: 'Địa chỉ IP không hợp lệ. Định dạng: 192.168.1.1'
    }
  }

  return { isValid: true }
}

// Computer specifications validation
export const validateSpecification = (spec: string, fieldName: string): ValidationResult => {
  if (!spec || spec.trim() === '') {
    return {
      isValid: false,
      message: `${fieldName} không được để trống`
    }
  }

  if (spec.trim().length < 2) {
    return {
      isValid: false,
      message: `${fieldName} phải có ít nhất 2 ký tự`
    }
  }

  if (spec.trim().length > 100) {
    return {
      isValid: false,
      message: `${fieldName} không được vượt quá 100 ký tự`
    }
  }

  return { isValid: true }
}

// Price per hour validation
export const validatePricePerHour = (price: number): ValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      message: 'Giá/giờ không được âm'
    }
  }

  if (price > 1000000) {
    return {
      isValid: false,
      message: 'Giá/giờ không được vượt quá 1,000,000 VND'
    }
  }

  if (price < 1000) {
    return {
      isValid: false,
      message: 'Giá/giờ tối thiểu là 1,000 VND'
    }
  }

  return { isValid: true }
}

// Product name validation
export const validateProductName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Tên sản phẩm không được để trống'
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Tên sản phẩm phải có ít nhất 2 ký tự'
    }
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      message: 'Tên sản phẩm không được vượt quá 100 ký tự'
    }
  }

  // Allow letters (including Vietnamese), numbers, spaces, and common product naming characters
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơẠẢÃẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỳỵỷỹạảãầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữự0-9\s\-_\.\(\)]+$/
  if (!namePattern.test(name.trim())) {
    return {
      isValid: false,
      message: 'Tên sản phẩm chỉ được chứa chữ cái, số, khoảng trắng và ký tự thông dụng'
    }
  }

  return { isValid: true }
}

// Supplier name validation
export const validateSupplierName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: true // Supplier name is optional
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Tên nhà cung cấp phải có ít nhất 2 ký tự'
    }
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      message: 'Tên nhà cung cấp không được vượt quá 100 ký tự'
    }
  }

  // Allow letters (including Vietnamese), numbers, spaces, and common business naming characters
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơẠẢÃẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỳỵỷỹạảãầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữự0-9\s\-_\.\(\)&]+$/
  if (!namePattern.test(name.trim())) {
    return {
      isValid: false,
      message: 'Tên nhà cung cấp chỉ được chứa chữ cái, số, khoảng trắng và ký tự thông dụng'
    }
  }

  return { isValid: true }
}

// Product price validation
export const validateProductPrice = (price: number): ValidationResult => {
  if (price < 0) {
    return {
      isValid: false,
      message: 'Giá sản phẩm không được âm'
    }
  }

  if (price > 10000000) {
    return {
      isValid: false,
      message: 'Giá sản phẩm không được vượt quá 10,000,000 VND'
    }
  }

  if (price < 100) {
    return {
      isValid: false,
      message: 'Giá sản phẩm tối thiểu là 100 VND'
    }
  }

  return { isValid: true }
}

// Stock validation
export const validateStock = (stock: number): ValidationResult => {
  if (stock < 0) {
    return {
      isValid: false,
      message: 'Số lượng tồn kho không được âm'
    }
  }

  if (stock > 10000) {
    return {
      isValid: false,
      message: 'Số lượng tồn kho không được vượt quá 10,000'
    }
  }

  return { isValid: true }
}

// Discount name validation
export const validateDiscountName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return {
      isValid: false,
      message: 'Tên giảm giá không được để trống'
    }
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      message: 'Tên giảm giá phải có ít nhất 2 ký tự'
    }
  }

  if (name.trim().length > 100) {
    return {
      isValid: false,
      message: 'Tên giảm giá không được vượt quá 100 ký tự'
    }
  }

  // Allow letters (including Vietnamese), numbers, spaces, and common discount naming characters
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơẠẢÃẦẨẪẬẮẰẲẴẶẸẺẼỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸỳỵỷỹạảãầẩẫậắằẳẵặẹẻẽềểễệỉịọỏốồổỗộớờởỡợụủứừửữự0-9\s\-_\.\(\)]+$/
  if (!namePattern.test(name.trim())) {
    return {
      isValid: false,
      message: 'Tên giảm giá chỉ được chứa chữ cái, số, khoảng trắng và ký tự thông dụng'
    }
  }

  return { isValid: true }
}

// Discount value validation
export const validateDiscountValue = (value: number, type: 'Flat' | 'Percentage'): ValidationResult => {
  if (value < 0) {
    return {
      isValid: false,
      message: 'Giá trị giảm giá không được âm'
    }
  }

  if (value === 0) {
    return {
      isValid: false,
      message: 'Giá trị giảm giá phải lớn hơn 0'
    }
  }

  if (type === 'Flat') {
    if (value > 10000000) {
      return {
        isValid: false,
        message: 'Giá trị giảm giá cố định không được vượt quá 10,000,000 VND'
      }
    }
    if (value < 1000) {
      return {
        isValid: false,
        message: 'Giá trị giảm giá cố định tối thiểu là 1,000 VND'
      }
    }
  } else if (type === 'Percentage') {
    if (value > 100) {
      return {
        isValid: false,
        message: 'Phần trăm giảm giá không được vượt quá 100%'
      }
    }
    if (value < 1) {
      return {
        isValid: false,
        message: 'Phần trăm giảm giá tối thiểu là 1%'
      }
    }
  }

  return { isValid: true }
}
