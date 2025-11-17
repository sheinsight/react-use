import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { normalizeElement } from './normalize-element'

import type { MutableRefObject, RefObject } from 'react'
import type { Gettable } from '../utils/basic'
import type { AtomBaseTarget, ElementTarget, GlobalTarget } from './normalize-element'

export * from './normalize-element'

export type UseTargetElementOptions = {
  /**
   * Callback when the target element is initialized
   *
   * @since 1.14.0
   */
  onInitialized?: (element: Element | GlobalTarget | null) => void
  /**
   * Callback when the target element changes
   *
   * @since 1.14.0
   */
  onChange?: (element: Element | GlobalTarget | null) => void
}

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
export function useTargetElement(target: any, options: UseTargetElementOptions = {}) {
  const elementRef = useRef(null)
  const initializedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const nextElement = normalizeElement(target)

    if (!initializedRef.current) {
      if (nextElement) {
        initializedRef.current = true
        elementRef.current = nextElement
        options.onInitialized?.(elementRef.current)
      }

      return
    }

    if (nextElement !== elementRef.current) {
      elementRef.current = nextElement
      options.onChange?.(nextElement)
    }
  })

  return elementRef
}
