import { useWebObserver } from '../use-web-observer'

import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UseMutationObserverOptions extends UseWebObserverOptions, MutationObserverInit {}
export interface UseMutationObserverReturns extends UseWebObserverReturns<MutationObserver> {}

/**
 * A React Hook that use [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) with ease.
 */
export function useMutationObserver(
  target: ElementTarget,
  callback: MutationCallback = () => {},
  options: UseMutationObserverOptions = {},
): UseMutationObserverReturns {
  const { immediate = true, ...observerOptions } = options

  return useWebObserver('MutationObserver', target, callback, { immediate }, undefined, observerOptions)
}
