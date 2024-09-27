import { act, renderHook } from '@/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { useRender } from './index'

describe('useRender', () => {
  const renderCount = { value: 0 }

  beforeEach(() => {
    renderCount.value = 0
  })

  it('should return a function', () => {
    const { result } = renderHook(() => useRender())
    expect(typeof result.current).toBe('function')
  })

  it('should re-render the component when the returned function is called', () => {
    const { result, rerender } = renderHook(() => {
      renderCount.value++
      return useRender()
    })

    expect(renderCount.value).toBe(1)

    act(() => {
      result.current()
    })

    expect(renderCount.value).toBe(2)

    rerender()
    rerender()

    expect(renderCount.value).toBe(4)

    act(() => {
      result.current()
    })

    expect(renderCount.value).toBe(5)

    act(() => {
      result.current()
      result.current()
      result.current()
    })

    // in React 18 and above, batch update will be triggered
    expect(renderCount.value).toBe(6)
  })
})
