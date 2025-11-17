import { useWebObserver } from '../use-web-observer'

import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturns } from '../use-web-observer'

export interface UseResizeObserverOptions extends UseWebObserverOptions, ResizeObserverOptions {
  /** @defaultValue 'content-box' */
  box?: ResizeObserverBoxOptions
}

export interface UseResizeObserverReturns extends Pausable, UseWebObserverReturns<ResizeObserver> {}

/**
 * A React Hook that helps to use [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) to observe the size changes of an element.
 */
export function useResizeObserver<T extends HTMLElement>(
  target: ElementTarget<T>,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
): UseResizeObserverReturns {
  const { immediate = true, ...observerOptions } = options
  return useWebObserver('ResizeObserver', target, callback, { immediate }, undefined, observerOptions)
}
