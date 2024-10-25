import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useEyeDropper } from './index'

describe('useEyeDropper', () => {
  it('should defined', () => {
    expect(useEyeDropper).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() =>
      useEyeDropper({
        initialValue: '#eaf',
      }),
    )

    expect(result.current.sRGBHex).toBe('#eaf')
    expect(result.current.isSupported).toBe(false)
    expect(result.current.open).toBeInstanceOf(Function)
  })
})
