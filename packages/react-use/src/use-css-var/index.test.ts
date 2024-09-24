import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCssVar } from './index'

describe('useCssVar', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should return default value when CSS variable is not set', () => {
    const { result } = renderHook(() => useCssVar('--test-var', { defaultValue: 'default' }))
    expect(result.current[0]).toBe('default')
  })

  it('should return the CSS variable value when it is set', () => {
    container.style.setProperty('--test-var', 'test-value')
    const { result } = renderHook(() => useCssVar('--test-var', { defaultValue: 'default' }, () => container))
    expect(result.current[0]).toBe('test-value')
  })

  it('should update the CSS variable value when setter is called', () => {
    const { result } = renderHook(() => useCssVar('--test-var', { defaultValue: 'default' }, () => container))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(container.style.getPropertyValue('--test-var')).toBe('new-value')
  })

  it('should update the state when CSS variable changes and observe is true', () => {
    const { result } = renderHook(() =>
      useCssVar('--test-var', { defaultValue: 'default', observe: true }, () => container),
    )

    act(() => {
      container.style.setProperty('--test-var', 'observed-value')
    })

    // Wait for MutationObserver to trigger
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      expect(result.current[0]).toBe('observed-value')
    })
  })

  it('should not update the state when CSS variable changes and observe is false', () => {
    const { result } = renderHook(() =>
      useCssVar('--test-var', { defaultValue: 'default', observe: false }, () => container),
    )

    act(() => {
      container.style.setProperty('--test-var', 'unobserved-value')
    })

    // Wait to ensure MutationObserver doesn't trigger
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      expect(result.current[0]).toBe('default')
    })
  })

  it('should work with a function as propName', () => {
    const getPropName = vi.fn(() => '--dynamic-var')
    container.style.setProperty('--dynamic-var', 'dynamic-value')

    const { result } = renderHook(() => useCssVar(getPropName, { defaultValue: 'default' }, () => container))

    expect(result.current[0]).toBe('dynamic-value')
    expect(getPropName).toHaveBeenCalled()
  })

  it('should work with a function as target', () => {
    const getTarget = vi.fn(() => container)
    container.style.setProperty('--test-var', 'target-value')

    const { result } = renderHook(() => useCssVar('--test-var', { defaultValue: 'default' }, getTarget))

    expect(result.current[0]).toBe('target-value')
    expect(getTarget).toHaveBeenCalled()
  })

  it('should use document.documentElement as default target', () => {
    document.documentElement.style.setProperty('--root-var', 'root-value')

    const { result } = renderHook(() => useCssVar('--root-var', { defaultValue: 'default' }))

    expect(result.current[0]).toBe('root-value')
  })

  it('should handle setter function correctly', () => {
    const { result } = renderHook(() => useCssVar('--test-var', { defaultValue: 'default' }, () => container))

    act(() => {
      result.current[1]((prev) => `${prev}-updated`)
    })

    expect(result.current[0]).toBe('default-updated')
    expect(container.style.getPropertyValue('--test-var')).toBe('default-updated')
  })
})
