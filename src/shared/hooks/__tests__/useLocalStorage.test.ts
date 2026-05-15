import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('returns default value when key absent', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage<string>('key', ''))
    act(() => result.current[1]('saved'))
    expect(localStorage.getItem('key')).toBe('"saved"')
  })

  it('reads existing localStorage value on mount', () => {
    localStorage.setItem('key', '"existing"')
    const { result } = renderHook(() => useLocalStorage('key', 'default'))
    expect(result.current[0]).toBe('existing')
  })
})
