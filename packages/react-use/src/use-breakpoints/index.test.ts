import { renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBreakpoints } from './index'

describe('useBreakpoints', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })

  it('should defined', () => {
    expect(useBreakpoints).toBeDefined()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useBreakpoints())

    expect(result.current.breakpoints).toEqual({
      lg: false,
      md: false,
      sm: false,
      xl: false,
      xxl: false,
    })

    expect(result.current.isInBetween).toBeInstanceOf(Function)
  })

  it('should handle isInBetween correctly', () => {
    const { result } = renderHook(() => useBreakpoints())

    expect(result.current.breakpoints).toEqual({
      lg: false,
      md: false,
      sm: false,
      xl: false,
      xxl: false,
    })

    expect(result.current.isInBetween('sm', 'md')).toBe(false)
  })
})
