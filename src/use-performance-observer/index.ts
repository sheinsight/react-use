import { useWebObserver } from '../use-web-observer'

import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UsePerformanceObserverOptions extends UseWebObserverOptions, PerformanceObserverInit {}
export interface UsePerformanceObserverReturns extends UseWebObserverReturns<PerformanceObserver> {}

/**
 * A React Hook that helps to use [PerformanceObserver API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) with ease.
 */
export function usePerformanceObserver(
  callback: PerformanceObserverCallback = () => {},
  options: UsePerformanceObserverOptions = {},
): UsePerformanceObserverReturns {
  const { immediate = true, ...observerOptions } = options

  return useWebObserver('PerformanceObserver', undefined, callback, { immediate }, undefined, observerOptions)
}
