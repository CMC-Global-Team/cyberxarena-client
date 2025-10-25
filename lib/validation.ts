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
  const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠưăâêôơ\s\-'\.]+$/
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
