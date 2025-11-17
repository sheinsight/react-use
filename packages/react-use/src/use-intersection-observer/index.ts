import { useWebObserver } from '../use-web-observer'

import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UseIntersectionObserverOptions extends UseWebObserverOptions, IntersectionObserverInit {}
export interface UseIntersectionObserverReturns extends UseWebObserverReturns<IntersectionObserver> {}

/**
 * A React Hook that uses the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) with ease.
 */
export function useIntersectionObserver(
  target: ElementTarget,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturns {
  const { immediate = true, ...initOptions } = options

  return useWebObserver('IntersectionObserver', target, callback, { immediate }, initOptions)
}
