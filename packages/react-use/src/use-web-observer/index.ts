import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useSupported } from '../use-supported'
import { useTargetElement } from '../use-target-element'
import { noop } from '../utils/basic'

import type { MutableRefObject } from 'react'
import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'

export interface UseWebObserverOptions {
  /**
   * Start the observer immediate after calling this function
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * Additional `isSupported` judgement
   */
  supported?: () => boolean
}

export interface UseWebObserverReturns<Observer> extends Pausable {
  /**
   * ref that holds the observer instance
   */
  observerRef: MutableRefObject<Observer | null>
  /**
   * Check if the observer is supported in the current environment
   */
  isSupported: boolean
}

export type WebObserverType =
  | 'IntersectionObserver'
  | 'MutationObserver'
  | 'ResizeObserver'
  | 'PerformanceObserver'
  | 'ReportingObserver'

/**
 * A low level React Hooks that helps to use Observer with ease. Available Observer:
 *
 * ```tsx
 * export type WebObserverType =
 *   | 'IntersectionObserver'
 *   | 'MutationObserver'
 *   | 'ResizeObserver'
 *   | 'PerformanceObserver'
 *   | 'ReportingObserver'
 * ```
 *
 * You should **NOT** use this Hook directly, use the high level Hooks below instead:
 *
 * - [useIntersectionObserver](https://sheinsight.github.io/react-use/reference/use-intersection-observer)
 * - [useMutationObserver](https://sheinsight.github.io/react-use/reference/use-mutation-observer)
 * - [useResizeObserver](https://sheinsight.github.io/react-use/reference/use-resize-observer)
 * - [usePerformanceObserver](https://sheinsight.github.io/react-use/reference/use-performance-observer)
 * - [useReportingObserver](https://sheinsight.github.io/react-use/reference/use-reporting-observer)
 *
 */
export function useWebObserver(
  observer: 'IntersectionObserver',
  target: ElementTarget,
  callback: IntersectionObserverCallback,
  options?: UseWebObserverOptions,
  initOptions?: IntersectionObserverInit,
  observerOptions?: undefined,
): UseWebObserverReturns<IntersectionObserver>
export function useWebObserver(
  observer: 'MutationObserver',
  target: ElementTarget,
  callback: MutationCallback,
  options?: UseWebObserverOptions,
  initOptions?: undefined,
  observerOptions?: MutationObserverInit,
): UseWebObserverReturns<MutationObserver>
export function useWebObserver(
  observer: 'ResizeObserver',
  target: ElementTarget,
  callback: ResizeObserverCallback,
  options?: UseWebObserverOptions,
  initOptions?: undefined,
  observerOptions?: ResizeObserverOptions,
): UseWebObserverReturns<ResizeObserver>
export function useWebObserver(
  observer: 'PerformanceObserver',
  target: undefined,
  callback: PerformanceObserverCallback,
  options?: UseWebObserverOptions,
  initOptions?: undefined,
  observerOptions?: PerformanceObserverInit,
): UseWebObserverReturns<PerformanceObserver>
export function useWebObserver(
  observer: 'ReportingObserver',
  target: undefined,
  callback: ReportingObserverCallback,
  options?: UseWebObserverOptions,
  initOptions?: ReportingObserverOptions,
  observerOptions?: undefined,
): UseWebObserverReturns<ReportingObserver>
export function useWebObserver(...args: any[]): any {
  const [observer, target, callback, options = {}, initOptions = {}, observerOptions = {}] = args
  const { immediate = true, supported = () => true } = options

  const isSupported = useSupported(() => observer in window && latest.current.supported())
  const observerRef = useRef<any | null>(null)

  const stopObserver = () => {
    if (observerRef.current) {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }

  const element = useTargetElement(target, {
    onChange() {
      pausable.pause()
      pausable.resume()
    },
  })

  const latest = useLatest({ supported, callback, initOptions, observerOptions })

  const pausable = usePausable(false, stopObserver, (ref) => {
    ref.current = false

    const { initOptions, observerOptions } = latest.current

    const hasNoElements = ['PerformanceObserver', 'ReportingObserver'].includes(observer)

    if (element.current || hasNoElements) {
      const Observer = window[observer] as any

      if (!Observer) return

      observerRef.current = new Observer((...args: any[]) => latest.current.callback(...args), initOptions)

      if (element.current) {
        observerRef.current?.observe(element.current, observerOptions)
      } else {
        observerRef.current?.observe(observerOptions)
      }

      ref.current = true
    }
  })

  useEffect(() => {
    if (immediate) {
      pausable.resume()
    }

    return immediate ? () => pausable.pause() : noop
  }, [immediate])

  return {
    ...pausable,
    observerRef,
    isSupported,
  }
}
