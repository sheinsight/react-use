import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useWebObserver } from './index'

describe('useWebObserver', () => {
  it('should defined', () => {
    expect(useWebObserver).toBeDefined()
  })

  it('should return initial state', async () => {
    const callback = vi.fn()

    const { result } = renderHook(() =>
      useWebObserver('MutationObserver', document.body, callback, { immediate: true }, undefined, { attributes: true }),
    )

    expect(result.current.isSupported).toBe(true)
    expect(result.current.observerRef.current).toBeDefined()
    expect(result.current.pause).toBeDefined()
    expect(result.current.resume).toBeDefined()
    expect(result.current.isActive).toBeInstanceOf(Function)

    expect(callback).not.toHaveBeenCalled()
  })

  it('should handle observer callback', async () => {
    const callback = vi.fn()

    renderHook(() =>
      useWebObserver('MutationObserver', document.body, callback, { immediate: true }, undefined, { attributes: true }),
    )

    expect(callback).not.toHaveBeenCalled()

    await act(async () => {
      document.body.setAttribute('data-test', 'test')
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle performance observer', async () => {
    const callback = vi.fn()

    renderHook(() =>
      useWebObserver('PerformanceObserver', undefined, callback, { immediate: true }, undefined, {
        entryTypes: ['measure'],
      }),
    )

    expect(callback).not.toHaveBeenCalled()

    await act(async () => {
      performance.mark('test')
      performance.measure('test', 'test')
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
