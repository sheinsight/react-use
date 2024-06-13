import { renderHook, renderHookServer } from '@/test'
import { expect, test, vi } from 'vitest'

import { useMount } from '.'

const mockCallback = vi.fn()

test('should call provided callback on mount in client', () => {
  renderHook(() => useMount(mockCallback))
  expect(mockCallback).toHaveBeenCalledTimes(1)
})

test('should not call provided callback on mount in Server-side Rendering (SSR)', () => {
  renderHookServer(() => useMount(mockCallback))
  expect(mockCallback).toHaveBeenCalledTimes(0)
})
