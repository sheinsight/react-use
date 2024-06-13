import { useWebObserver } from '../use-web-observer'

import type { UseWebObserverOptions, UseWebObserverReturn } from '../use-web-observer'

export interface UsePerformanceObserverOptions extends UseWebObserverOptions, PerformanceObserverInit {}
export interface UsePerformanceObserverReturn extends UseWebObserverReturn<PerformanceObserver> {}

export function usePerformanceObserver(
  callback: PerformanceObserverCallback = () => {},
  options: UsePerformanceObserverOptions = {},
): UsePerformanceObserverReturn {
  const { immediate = true, ...observerOptions } = options

  return useWebObserver('PerformanceObserver', undefined, callback, { immediate }, undefined, observerOptions)
}
