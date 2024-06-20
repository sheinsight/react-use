import { useWebObserver } from '../use-web-observer'

import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'
import type { UseWebObserverOptions, UseWebObserverReturn } from '../use-web-observer'
import type { Arrayable } from '../utils/basic'

export interface UseResizeObserverOptions extends UseWebObserverOptions, ResizeObserverOptions {
  /** @defaultValue 'content-box' */
  box?: ResizeObserverBoxOptions
}

export interface UseResizeObserverReturn extends Pausable, UseWebObserverReturn<ResizeObserver> {}

export function useResizeObserver<T extends HTMLElement>(
  target: Arrayable<ElementTarget<T>>,
  callback: ResizeObserverCallback,
  options: UseResizeObserverOptions = {},
): UseResizeObserverReturn {
  const { immediate = true, ...observerOptions } = options
  return useWebObserver('ResizeObserver', target, callback, { immediate }, undefined, observerOptions)
}
