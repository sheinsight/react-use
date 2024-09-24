import { type RenderHookResult, act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFirstRender } from './index'

describe('useFirstRender', () => {
  let result: RenderHookResult<boolean, object>

  beforeEach(() => {
    result = renderHook(() => useFirstRender())
  })

  it('should return true on the first render', () => {
    expect(result.result.current).toBe(true)
  })

  it('should return false on subsequent renders', () => {
    act(() => {
      result.rerender()
    })
    expect(result.result.current).toBe(false)
  })

  it('should return false on multiple renders', () => {
    act(() => {
      result.rerender()
      result.rerender()
      result.rerender()
    })
    expect(result.result.current).toBe(false)
  })
})
