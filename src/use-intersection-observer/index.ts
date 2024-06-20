import { useWebObserver } from '../use-web-observer'

import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'
import type { Arrayable } from '../utils/basic'

export interface UseIntersectionObserverOptions extends UseWebObserverOptions, IntersectionObserverInit {}
export interface UseIntersectionObserverReturns extends UseWebObserverReturns<IntersectionObserver> {}

export function useIntersectionObserver(
  target: Arrayable<ElementTarget>,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturns {
  const { immediate = true, ...initOptions } = options

  return useWebObserver('IntersectionObserver', target, callback, { immediate }, initOptions)
}
