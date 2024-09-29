import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextDirection } from './index'

describe('useTextDirection', () => {
  let targetElement: HTMLElement

  beforeEach(() => {
    targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
    vi.useRealTimers()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTextDirection())
    expect(result.current[0]).toBe('ltr')
  })

  it('should initialize with custom initialValue', () => {
    const { result } = renderHook(() => useTextDirection({ initialValue: 'rtl' }))
    expect(result.current[0]).toBe('rtl')
  })

  it('should set the text direction attribute on mount', () => {
    const { result } = renderHook(() => useTextDirection({ target: targetElement }))
    act(() => {
      result.current[1]('rtl')
    })
    expect(targetElement.getAttribute('dir')).toBe('rtl')
  })

  it('should update the text direction attribute when setDir is called', () => {
    const { result } = renderHook(() => useTextDirection({ target: targetElement }))
    act(() => {
      result.current[1]('auto')
    })
    expect(targetElement.getAttribute('dir')).toBe('auto')
  })

  it('should remove the text direction attribute when dir is empty', () => {
    const { result } = renderHook(() => useTextDirection({ target: targetElement }))
    act(() => {
      result.current[1]('rtl')
    })
    expect(targetElement.getAttribute('dir')).toBe('rtl')
    act(() => {
      result.current[1]('')
    })
    expect(targetElement.hasAttribute('dir')).toBe(false)
  })

  it('should use the dir attribute from the target element', () => {
    targetElement.setAttribute('dir', 'rtl')
    const { result } = renderHook(() => useTextDirection({ target: targetElement }))
    expect(result.current[0]).toBe('rtl')
  })

  it('should fallback to initialValue if dir attribute is not set', () => {
    const { result } = renderHook(() => useTextDirection({ target: targetElement, initialValue: 'auto' }))
    expect(result.current[0]).toBe('auto')
  })
})
