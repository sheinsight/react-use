import { useWebObserver } from '../use-web-observer'

import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturn } from '../use-web-observer'
import type { Arrayable } from '../utils'

export interface UseMutationObserverOptions extends UseWebObserverOptions, MutationObserverInit {}
export interface UseMutationObserverReturn extends UseWebObserverReturn<MutationObserver> {}

export function useMutationObserver(
  target: Arrayable<ElementTarget>,
  callback: MutationCallback = () => {},
  options: UseMutationObserverOptions = {},
): UseMutationObserverReturn {
  const { immediate = true, ...observerOptions } = options

  return useWebObserver('MutationObserver', target, callback, { immediate }, undefined, observerOptions)
}
