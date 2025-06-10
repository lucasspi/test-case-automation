// Simple utility functions for demonstration
export const add = (a: number, b: number): number => {
  return a + b
}

export const multiply = (a: number, b: number): number => {
  return a * b
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const isEven = (num: number): boolean => {
  return num % 2 === 0
}
