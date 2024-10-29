import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useFullscreen } from './index'

describe('useFullscreen', () => {
  it('should defined', () => {
    expect(useFullscreen).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useFullscreen())

    expect(result.current.isSupported).toBe(false)
    expect(result.current.isFullscreen).toBe(false)
    expect(result.current.isSelfFullscreen).toBe(false)

    expect(result.current.enter).toBeInstanceOf(Function)
    expect(result.current.exit).toBeInstanceOf(Function)
    expect(result.current.toggle).toBeInstanceOf(Function)
  })
})
