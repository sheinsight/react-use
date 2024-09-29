import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type UseStyleTagReturns, useStyleTag } from '../index'

describe('useStyleTag', () => {
  let hookResult: { current: UseStyleTagReturns }

  beforeEach(() => {
    vi.useFakeTimers()
    hookResult = renderHook(() => useStyleTag('body { color: red; }')).result
  })

  afterEach(() => {
    vi.useRealTimers()
    hookResult.current.unload()
  })

  it('should initialize with default values', () => {
    expect(hookResult.current.css).toBe('body { color: red; }')
    expect(hookResult.current.isLoaded.current).toBe(true)
  })

  it('should load the style tag', () => {
    act(() => {
      hookResult.current.load()
    })

    expect(hookResult.current.isLoaded.current).toBe(true)
    expect(document.head.querySelector('style')).not.toBeNull()
  })

  it('should update CSS content', () => {
    act(() => {
      hookResult.current.load()
    })

    act(() => {
      hookResult.current.setCss('new-css')
    })

    expect(hookResult.current.css).toBe('new-css')
    expect(hookResult.current.styleTag.current?.textContent).toBe('new-css')
  })

  it('should reset CSS content', () => {
    act(() => {
      hookResult.current.load()
    })

    act(() => {
      hookResult.current.setCss('new-css')
      hookResult.current.resetCss()
    })

    expect(hookResult.current.css).toBe('body { color: red; }')
    expect(hookResult.current.styleTag.current?.textContent).toBe('body { color: red; }')
  })

  it('should unload the style tag', () => {
    act(() => {
      hookResult.current.load()
    })

    act(() => {
      hookResult.current.unload()
    })

    expect(hookResult.current.isLoaded.current).toBe(false)
    expect(document.head.querySelector('style')).toBeNull()
  })

  it('should handle immediate loading', () => {
    const { result } = renderHook(() => useStyleTag('css', { immediate: true }))
    expect(result.current.isLoaded.current).toBe(true)
  })

  it('should not unload if manual is true', () => {
    act(() => {
      hookResult.current.load()
    })

    act(() => {
      hookResult.current.unload()
    })

    act(() => {
      hookResult.current.load()
    })

    expect(hookResult.current.isLoaded.current).toBe(true)

    act(() => {
      hookResult.current.unload()
    })

    expect(hookResult.current.isLoaded.current).toBe(false)

    act(() => {
      hookResult.current.load()
    })

    expect(hookResult.current.isLoaded.current).toBe(true)
  })
})
