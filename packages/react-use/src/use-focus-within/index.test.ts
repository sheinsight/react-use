import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useFocusWithin } from './index'

describe('useFocusWithin', () => {
  let targetElement: HTMLElement

  beforeEach(() => {
    targetElement = document.createElement('div')
    targetElement.tabIndex = 0 // It's needed to track the focus state
    document.body.appendChild(targetElement)
  })

  afterEach(() => {
    document.body.removeChild(targetElement)
  })

  it('should return false when no element is focused', () => {
    const { result } = renderHook(() => useFocusWithin(targetElement))
    expect(result.current).toBe(false)
  })

  it('should return true when the target element is focused', () => {
    const { result } = renderHook(() => useFocusWithin(targetElement))

    expect(result.current).toBe(false)

    act(() => {
      targetElement.focus()
    })

    expect(result.current).toBe(true)
  })

  it('should return true when a child element is focused', () => {
    const childElement = document.createElement('input')
    targetElement.appendChild(childElement)

    const { result } = renderHook(() => useFocusWithin(targetElement))
    act(() => {
      childElement.focus()
    })
    expect(result.current).toBe(true)
  })

  it('should return false when focus moves outside the target element', () => {
    const { result } = renderHook(() => useFocusWithin(targetElement))
    act(() => {
      targetElement.focus()
    })
    expect(result.current).toBe(true)

    const outsideElement = document.createElement('div')
    outsideElement.tabIndex = 0
    document.body.appendChild(outsideElement)
    act(() => {
      outsideElement.focus()
    })
    expect(result.current).toBe(false)

    document.body.removeChild(outsideElement)
  })

  it('should update focus state when focus changes', () => {
    const { result } = renderHook(() => useFocusWithin(targetElement))
    act(() => {
      targetElement.focus()
    })
    expect(result.current).toBe(true)

    const childElement = document.createElement('input')
    childElement.tabIndex = 0
    targetElement.appendChild(childElement)
    act(() => {
      childElement.focus()
    })
    expect(result.current).toBe(true)
    act(() => {
      childElement.blur()
    })
    expect(result.current).toBe(false)
  })
})
