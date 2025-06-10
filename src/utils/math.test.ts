import { describe, it, expect } from 'vitest'
import { add, multiply, formatCurrency, isEven } from './math'

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5)
    })

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5)
    })

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).toBe(2)
    })

    it('should handle zero', () => {
      expect(add(0, 5)).toBe(5)
      expect(add(5, 0)).toBe(5)
    })
  })

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12)
    })

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0)
    })

    it('should multiply negative numbers', () => {
      expect(multiply(-2, -3)).toBe(6)
      expect(multiply(-2, 3)).toBe(-6)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-50)).toBe('-$50.00')
    })
  })

  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true)
      expect(isEven(0)).toBe(true)
      expect(isEven(-4)).toBe(true)
    })

    it('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false)
      expect(isEven(3)).toBe(false)
      expect(isEven(-1)).toBe(false)
    })
  })
})
