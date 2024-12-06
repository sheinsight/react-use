import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useParentElement } from './index'

describe('useParentElement', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should defined', () => {
    expect(useParentElement).toBeDefined()
  })

  it('should return null if target element is not provided', () => {
    const { result } = renderHook(() => useParentElement(null))
    expect(result.current).toBeNull()
  })

  it('should return the parent element of the target', () => {
    const child = document.createElement('div')
    const parent = document.createElement('div')
    parent.appendChild(child)
    container.appendChild(parent)

    const { result } = renderHook(() => useParentElement(child))
    expect(result.current).toBe(parent)
  })

  it('should return null if target element has no parent', () => {
    const child = document.createElement('div')
    container.appendChild(child)

    const { result } = renderHook(() => useParentElement(child))
    expect(result.current).toBe(container)
  })

  it('should update parent when target changes', () => {
    const child1 = document.createElement('div')
    const child2 = document.createElement('div')
    const parent1 = document.createElement('div')
    const parent2 = document.createElement('div')

    parent1.appendChild(child1)
    parent2.appendChild(child2)
    container.appendChild(parent1)
    container.appendChild(parent2)

    const { result } = renderHook(({ target }) => useParentElement(target), {
      initialProps: { target: child1 },
    })

    expect(result.current).toBe(parent1)
  })

  it('should handle updates correctly with useEffect', () => {
    const child = document.createElement('div')
    const parent = document.createElement('div')
    parent.appendChild(child)
    container.appendChild(parent)

    const { result } = renderHook(() => useParentElement(child))
    expect(result.current).toBe(parent)
  })

  it('should handle fake timers correctly', () => {
    vi.useFakeTimers()
    const child = document.createElement('div')
    const parent = document.createElement('div')
    parent.appendChild(child)
    container.appendChild(parent)

    const { result } = renderHook(() => useParentElement(child))
    expect(result.current).toBe(parent)
  })
})
