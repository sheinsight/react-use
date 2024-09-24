import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useFocus } from './index'

describe('useFocus', () => {
  let targetElement: HTMLInputElement

  beforeEach(() => {
    targetElement = document.createElement('input')
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
  })

  it('should initialize with default focus state as false', () => {
    const { result } = renderHook(() => useFocus(targetElement))
    expect(result.current[0]).toBe(false)
  })

  it('should initialize with provided initialValue', () => {
    const { result } = renderHook(() => useFocus(targetElement, { initialValue: true }))
    expect(result.current[0]).toBe(true)
  })

  it('should focus the element when focus is called', () => {
    const { result } = renderHook(() => useFocus(targetElement))
    act(() => {
      result.current[1].focus()
    })
    expect(document.activeElement).toBe(targetElement)
  })

  it('should blur the element when blur is called', () => {
    const { result } = renderHook(() => useFocus(targetElement))
    act(() => {
      result.current[1].focus()
    })
    act(() => {
      result.current[1].blur()
    })
    expect(document.activeElement).not.toBe(targetElement)
  })

  it('should update focused state on focus event', () => {
    const { result } = renderHook(() => useFocus(targetElement))
    act(() => {
      targetElement.focus()
    })
    expect(result.current[0]).toBe(true)
  })

  it('should update focused state on blur event', () => {
    const { result } = renderHook(() => useFocus(targetElement))
    act(() => {
      targetElement.focus()
    })
    act(() => {
      targetElement.blur()
    })
    expect(result.current[0]).toBe(false)
  })

  it('should handle focus and blur correctly when mounted', () => {
    const { result } = renderHook(() => useFocus(targetElement, { initialValue: false }))
    act(() => {
      targetElement.focus()
    })
    expect(result.current[0]).toBe(true)
    act(() => {
      targetElement.blur()
    })
    expect(result.current[0]).toBe(false)
  })
})
