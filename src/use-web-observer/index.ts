import { useEffect, useRef } from 'react'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useSupported } from '../use-supported'
import { normalizeElement } from '../use-target-element'
import { notNullish } from '../utils/basic'
import { unwrapArrayable } from '../utils/unwrap'

import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'
import type { Arrayable } from '../utils/basic'

export interface UseWebObserverOptions {
  /**
   * Start the observer immediate after calling this function
   *
   * @defaultValue true
   */
  immediate?: boolean
}

export interface UseWebObserverReturns<Observer> extends Pausable {
  /**
   * ref that holds the observer instance
   */
  observerRef: React.MutableRefObject<Observer | null>
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

function getElements(target: Arrayable<ElementTarget>) {
  return unwrapArrayable(target).map(normalizeElement).filter(notNullish)
}

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
  target: Arrayable<ElementTarget>,
  callback: IntersectionObserverCallback,
  options?: UseWebObserverOptions,
  initOptions?: IntersectionObserverInit,
  observerOptions?: undefined,
): UseWebObserverReturns<IntersectionObserver>
export function useWebObserver(
  observer: 'MutationObserver',
  target: Arrayable<ElementTarget>,
  callback: MutationCallback,
  options?: UseWebObserverOptions,
  initOptions?: undefined,
  observerOptions?: MutationObserverInit,
): UseWebObserverReturns<MutationObserver>
export function useWebObserver(
  observer: 'ResizeObserver',
  target: Arrayable<ElementTarget>,
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
  const { immediate = true } = options

  const isSupported = useSupported(() => observer in window)
  const observerRef = useRef<any | null>(null)

  const stopObserver = () => {
    observerRef.current?.disconnect()
    observerRef.current = null
  }

  const pausable = usePausable(false, stopObserver, (ref) => {
    ref.current = false

    const { initOptions, observerOptions, target } = latest.current
    const els = getElements(target)

    const hasNoElements = ['PerformanceObserver', 'ReportingObserver'].includes(observer)

    if (els.length || hasNoElements) {
      ref.current = true
      const Observer = window[observer] as any
      observerRef.current = new Observer((...args: any[]) => latest.current.callback(...args), initOptions)

      if (els.length) {
        for (const el of els) {
          observerRef.current?.observe(el, observerOptions)
        }
      } else {
        observerRef.current?.observe(observerOptions)
      }
    }
  })

  const latest = useLatest({ target, callback, initOptions, observerOptions })

  useEffect(() => {
    immediate && pausable.resume()
    return pausable.pause
  }, [immediate])

  return {
    ...pausable,
    observerRef,
    isSupported,
  }
}
