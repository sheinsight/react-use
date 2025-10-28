import { render, renderHook } from '@/test'
import { Activity, StrictMode, useState } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { useActivityMount } from './index'

describe('useActivityMount', () => {
  test('should call the callback function when the component mounts', () => {
    const callback = vi.fn()
    renderHook(() => useActivityMount(callback))

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should call the callback function only once in strict mode', () => {
    const callback = vi.fn()
    renderHook(() => useActivityMount(callback), { wrapper: StrictMode })

    // With strictOnce=true (default for useActivityMount), should only be called once
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should not call the callback function when it is not provided', () => {
    const callback = vi.fn()
    renderHook(() => useActivityMount())

    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback function on re-renders', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(() => useActivityMount(callback))

    rerender()

    // Should only be called once, not on re-renders
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should support async callback functions', async () => {
    const callback = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return 'done'
    })

    renderHook(() => useActivityMount(callback))

    expect(callback).toHaveBeenCalledTimes(1)

    // Wait for async callback to complete
    await vi.waitFor(() => {
      expect(callback).toHaveReturned()
    })
  })

  test('should handle null, undefined, and false callback values', () => {
    const { rerender } = renderHook(({ cb }) => useActivityMount(cb), {
      initialProps: { cb: null as any },
    })

    expect(() => rerender({ cb: undefined as any })).not.toThrow()
    expect(() => rerender({ cb: false as any })).not.toThrow()
  })

  test('should maintain strictOnce behavior across multiple instances', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    renderHook(() => useActivityMount(callback1), { wrapper: StrictMode })
    renderHook(() => useActivityMount(callback2), { wrapper: StrictMode })

    // Each instance should maintain its own strictOnce state
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  test('should only call callback once when Activity is hidden and shown again', () => {
    const callback = vi.fn()

    function TestComponent({ visible }: { visible: boolean }) {
      return (
        <Activity mode={visible ? 'visible' : 'hidden'}>
          <Child />
        </Activity>
      )
    }

    function Child() {
      useActivityMount(callback)
      return <div>Child</div>
    }

    const { rerender } = render(<TestComponent visible={true} />)

    // Callback should be called once on mount
    expect(callback).toHaveBeenCalledTimes(1)

    // Hide the Activity
    rerender(<TestComponent visible={false} />)
    expect(callback).toHaveBeenCalledTimes(1)

    // Show the Activity again
    rerender(<TestComponent visible={true} />)
    // Callback should still only be called once, not again when shown
    expect(callback).toHaveBeenCalledTimes(1)

    // Hide and show multiple times
    rerender(<TestComponent visible={false} />)
    rerender(<TestComponent visible={true} />)
    rerender(<TestComponent visible={false} />)
    rerender(<TestComponent visible={true} />)

    // Should still only be called once
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should work with Activity state toggles', () => {
    const callback = vi.fn()

    function TestApp() {
      const [visible, setVisible] = useState(true)

      return (
        <div>
          <button type="button" onClick={() => setVisible(!visible)}>
            Toggle
          </button>
          <Activity mode={visible ? 'visible' : 'hidden'}>
            <Child />
          </Activity>
        </div>
      )
    }

    function Child() {
      useActivityMount(() => {
        callback()
      })
      return <div>Child</div>
    }

    const { getByRole } = render(<TestApp />)

    // Initial mount
    expect(callback).toHaveBeenCalledTimes(1)

    // Click toggle button multiple times
    const button = getByRole('button')
    button.click() // hide
    expect(callback).toHaveBeenCalledTimes(1)

    button.click() // show
    expect(callback).toHaveBeenCalledTimes(1)

    button.click() // hide
    expect(callback).toHaveBeenCalledTimes(1)

    button.click() // show
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
