import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useAdaptiveTextarea } from './index'

describe('useAdaptiveTextarea', () => {
  it('should return a ref and a resize function', () => {
    const { result } = renderHook(() => useAdaptiveTextarea())
    expect(result.current.ref).toBeDefined()
    expect(typeof result.current.resize).toBe('function')
  })
})
