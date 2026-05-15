import { describe, it, expect } from 'vitest'
import { formatCurrency, formatNumber, formatDate, formatPercent } from '../formatters'

describe('formatCurrency', () => {
  it('formats positive number as USD', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
  })
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('formatNumber', () => {
  it('formats with thousands separator', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

describe('formatDate', () => {
  it('formats ISO string to readable date', () => {
    expect(formatDate('2024-01-15T00:00:00Z')).toBe('Jan 15, 2024')
  })
})

describe('formatPercent', () => {
  it('formats positive change with + sign', () => {
    expect(formatPercent(12.5)).toBe('+12.5%')
  })
  it('formats negative change', () => {
    expect(formatPercent(-3.2)).toBe('-3.2%')
  })
})
