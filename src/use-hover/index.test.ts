import { act, renderHook } from '@/test'
import { describe, expect, it, vi } from 'vitest'
import { useHover } from './index'

describe('useHover', () => {
  it('should return false initially', () => {
    const { result } = renderHook(() => useHover(() => document.body))
    expect(result.current).toBe(false)
  })

  it('should return true when mouse enters the target element', () => {
    const { result } = renderHook(() => useHover(() => document.body))
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter')
      document.body.dispatchEvent(mouseEnterEvent)
    })
    expect(result.current).toBe(true)
  })

  it('should return false when mouse leaves the target element', () => {
    const { result } = renderHook(() => useHover(() => document.body))
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter')
      document.body.dispatchEvent(mouseEnterEvent)
    })
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave')
      document.body.dispatchEvent(mouseLeaveEvent)
    })
    expect(result.current).toBe(false)
  })

  it('should call the onEnter event handler when mouse enters the target element', () => {
    const onEnter = vi.fn()
    renderHook(() => useHover(() => document.body, { onEnter }))
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter')
      document.body.dispatchEvent(mouseEnterEvent)
    })
    expect(onEnter).toHaveBeenCalledTimes(1)
    expect(onEnter).toHaveBeenCalledWith(expect.any(MouseEvent))
  })

  it('should call the onLeave event handler when mouse leaves the target element', () => {
    const onLeave = vi.fn()
    renderHook(() => useHover(() => document.body, { onLeave }))
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter')
      document.body.dispatchEvent(mouseEnterEvent)
    })
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave')
      document.body.dispatchEvent(mouseLeaveEvent)
    })
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onLeave).toHaveBeenCalledWith(expect.any(MouseEvent))
  })

  it('should call the onChange event handler when mouse enters or leaves the target element', () => {
    const onChange = vi.fn()
    renderHook(() => useHover(() => document.body, { onChange }))
    act(() => {
      const mouseEnterEvent = new MouseEvent('mouseenter')
      document.body.dispatchEvent(mouseEnterEvent)
    })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(true, expect.any(MouseEvent))
    act(() => {
      const mouseLeaveEvent = new MouseEvent('mouseleave')
      document.body.dispatchEvent(mouseLeaveEvent)
    })
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledWith(false, expect.any(MouseEvent))
  })
})
