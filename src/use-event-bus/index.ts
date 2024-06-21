import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'

import type { AnyFunc, Noop } from '../utils/basic'

// biome-ignore lint/suspicious/noExplicitAny: need any
export type EventBusListener<T = any, P = any> = (event: T, payload?: P) => void
// biome-ignore lint/suspicious/noExplicitAny: need any
export type EventBusEvents<T, P = any> = Set<EventBusListener<T, P>>
export type EventBusIdentifier = symbol | string | number

export interface UseEventBusReturns<T, P> {
  /**
   * Subscribe to an event. When calling emit, the listeners will execute.
   *
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  on: (listener: EventBusListener<T, P>) => AnyFunc
  /**
   * Similar to `on`, but only fires once
   *
   * @param listener watch listener.
   * @returns a stop function to remove the current callback.
   */
  once: (listener: EventBusListener<T, P>) => AnyFunc
  /**
   * Emit an event, the corresponding event listeners will execute.
   *
   * @param event data sent.
   */
  emit: (event?: T, payload?: P) => void
  /**
   * Remove the corresponding listener.
   *
   * @param listener watch listener.
   */
  off: (listener: EventBusListener<T>) => void
  /**
   * Clear all events in global scope
   */
  reset(): void
  /**
   * Clear all listeners in the current component context
   */
  cleanup(): void
}

export interface UseEventBusOptions {
  /**
   * Whether to automatically clean up the listener when the component is unmounted.
   *
   * @defaultValue true
   */
  autoCleanup?: boolean
}

// biome-ignore lint/suspicious/noExplicitAny: need any
export const events = /* #__PURE__ */ new Map<EventBusIdentifier, EventBusEvents<any>>()

/**
 * A React Hook that provides a simple event bus for your application.
 */
// biome-ignore lint/suspicious/noExplicitAny: need any
export function useEventBus<T = any, P = any>(
  key: EventBusIdentifier,
  options: UseEventBusOptions = {},
): UseEventBusReturns<T, P> {
  const { autoCleanup = true } = options

  const cleanups = useRef<Noop[]>([])
  const latest = useLatest({ key })

  const on = useStableFn((listener: EventBusListener<T, P>) => {
    const { key } = latest.current
    const listeners = events.get(key) || new Set()
    listeners.add(listener)
    events.set(key, listeners)
    const cleanup = () => off(listener)
    cleanups.current.push(cleanup)
    return cleanup
  })

  const once = useStableFn((listener: EventBusListener<T, P>) => {
    function _listener(...args: Parameters<EventBusListener<T, P>>) {
      off(_listener)
      listener(...args)
    }
    on(_listener)
    const cleanup = () => off(_listener)
    cleanups.current.push(cleanup)
    return cleanup
  })

  const off = useStableFn((listener: EventBusListener<T>): void => {
    const listeners = events.get(latest.current.key)
    if (!listeners) return
    listeners.delete(listener)
    if (!listeners.size) reset()
  })

  const emit = useStableFn((event?: T, payload?: P) => {
    for (const notice of events.get(latest.current.key) ?? []) {
      notice(event, payload)
    }
  })

  // for global events reset
  const reset = useStableFn(() => events.delete(latest.current.key))

  // for current component auto unmount cleanup
  const cleanup = useStableFn(() => {
    for (const cleanup of cleanups.current) cleanup()
    cleanups.current.length = 0
  })

  useUnmount(autoCleanup && cleanup)

  return {
    on,
    once,
    off,
    emit,
    reset,
    cleanup,
  }
}
