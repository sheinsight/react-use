import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTitle } from './index'

describe('useTitle', () => {
  const originalTitle = document.title

  afterEach(() => {
    document.title = originalTitle
  })

  beforeEach(() => {
    document.title = originalTitle
  })

  it('should update document title', () => {
    renderHook(() => useTitle('New Title'))
    expect(document.title).toBe('New Title')
  })

  it('should format title using string template', () => {
    renderHook(() => useTitle('Page Title', { template: 'My Website - %s' }))
    expect(document.title).toBe('My Website - Page Title')
  })

  it('should format title using function template', () => {
    renderHook(() => useTitle('Page Title', { template: (title) => `Custom - ${title}` }))
    expect(document.title).toBe('Custom - Page Title')
  })

  it('should restore original title on unmount', () => {
    const { unmount } = renderHook(() => useTitle('New Title', { restoreOnUnmount: true }))
    expect(document.title).toBe('New Title')
    unmount()
    expect(document.title).toBe(originalTitle)
  })

  it('should not restore original title on unmount (default behavior)', () => {
    const { unmount } = renderHook(() => useTitle('New Title'))
    expect(document.title).toBe('New Title')
    unmount()
    expect(document.title).toBe('New Title')
  })

  it('should return a function to restore original title', () => {
    const { result } = renderHook(() => useTitle('New Title'))
    expect(document.title).toBe('New Title')
    result.current()
    expect(document.title).toBe(originalTitle)
  })
})
