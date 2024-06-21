import { useEffect, useRef } from 'react'
import { normalizeElement } from './normalize-element'

import type { MutableRefObject, RefObject } from 'react'
import type { Gettable } from '../utils/basic'
import type { AtomBaseTarget, ElementTarget, GlobalTarget } from './normalize-element'

export * from './normalize-element'

// biome-ignore lint/complexity/noBannedTypes: for the future
export type UseTargetElementOptions = {}

/**
 * A React Hook that helps to get the target element via selector, ref, element and more.
 */
export function useTargetElement<T extends GlobalTarget>(
  target: Gettable<T>,
  options?: UseTargetElementOptions,
): RefObject<T>
export function useTargetElement<T extends Element | null>(
  target: Gettable<T>,
  options?: UseTargetElementOptions,
): RefObject<T>
export function useTargetElement<T extends keyof HTMLElementTagNameMap>(
  target: Gettable<T>,
  options?: UseTargetElementOptions,
): RefObject<HTMLElementTagNameMap[T]>
export function useTargetElement<T extends keyof SVGElementTagNameMap>(
  target: Gettable<T>,
  options?: UseTargetElementOptions,
): RefObject<SVGElementTagNameMap[T]>
export function useTargetElement<A extends AtomBaseTarget, T extends ElementTarget<A> = ElementTarget<A>>(
  target: Gettable<T>,
  options?: UseTargetElementOptions,
): RefObject<A>
export function useTargetElement<
  R extends GlobalTarget | Element,
  T extends string | null | undefined | false | MutableRefObject<AtomBaseTarget | undefined> | R,
>(target: Gettable<T>, options?: UseTargetElementOptions): RefObject<R>
// biome-ignore lint/suspicious/noExplicitAny: for overload
export function useTargetElement(target: any, _options: UseTargetElementOptions = {}) {
  const elementRef = useRef(null)

  useEffect(() => {
    elementRef.current = normalizeElement(target)
  }, [target])

  return elementRef
}
