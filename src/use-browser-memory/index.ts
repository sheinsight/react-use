import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { timestamp } from '../utils/basic'

import type { UseIntervalFnOptions } from '../use-interval-fn'

/**
 * Performance.memory
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
 */
export interface MemoryInfo {
  /**
   * The maximum size of the heap, in bytes, that is available to the context.
   */
  readonly jsHeapSizeLimit: number
  /**
   *  The total allocated heap size, in bytes.
   */
  readonly totalJSHeapSize: number
  /**
   * The currently active segment of JS heap, in bytes.
   */
  readonly usedJSHeapSize: number

  [Symbol.toStringTag]: 'MemoryInfo'
}

export interface UseBrowserMemoryOptions extends UseIntervalFnOptions {
  interval?: number
}

export interface PerformanceWithMemory extends Performance {
  memory: MemoryInfo
}

export interface UseBrowserMemoryReturn {
  /**
   * The timestamp when the memory info was last updated.
   */
  timestamp: number
  /**
   * The memory info.
   */
  memory: MemoryInfo | undefined
  /**
   * The maximum size of the heap, in bytes, that is available to the context.
   */
  jsHeapSizeLimit: number
  /**
   * The total allocated heap size, in bytes.
   */
  totalJSHeapSize: number
  /**
   * The used heap size, in bytes.
   */
  usedJSHeapSize: number
  /**
   *  Whether the browser supports the `Performance.memory` API.
   */
  isSupported: boolean
  /**
   * Update the memory info.
   */
  update(): void
}

export function useBrowserMemory(options: UseBrowserMemoryOptions = {}): UseBrowserMemoryReturn {
  const { interval = 1000, ...useIntervalFnOptions } = options

  // https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory#browser_compatibility
  const isSupported = useSupported(() => 'memory' in performance)
  const latest = useLatest({ isSupported })

  const [state, setState] = useSafeState({
    timestamp: Date.now(),
    memory: undefined as MemoryInfo | undefined,
  })

  const update = useStableFn(() => {
    if (!latest.current.isSupported) return

    setState({
      memory: (performance as PerformanceWithMemory).memory,
      timestamp: timestamp(),
    })
  })

  useIntervalFn(update, interval, { immediateCallback: true, ...useIntervalFnOptions })

  const memoryDetail = {
    jsHeapSizeLimit: state.memory?.jsHeapSizeLimit || 0,
    totalJSHeapSize: state.memory?.totalJSHeapSize || 0,
    usedJSHeapSize: state.memory?.usedJSHeapSize || 0,
  } as const

  return {
    ...state,
    ...memoryDetail,
    isSupported,
    update,
  }
}
