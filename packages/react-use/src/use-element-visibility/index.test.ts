import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useElementVisibility } from './index'

describe('useElementVisibility', () => {
  it('should defined', () => {
    expect(useElementVisibility).toBeDefined()
  })

  it('should return initial visibility', () => {
    const { result } = renderHook(() => useElementVisibility('body'))
    expect(result.current).toBe(false)
  })
})
