import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { normalizeElement, useTargetElement } from '../use-target-element'
import { isString, notNullish } from '../utils/basic'

import type { ElementTarget } from '../use-target-element'

export interface UseClickOutsideOptions {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: ElementTarget[]
}

export type UseClickOutsideHandler = (evt: MouseEvent | PointerEvent) => void

/**
 * A React Hook that allows you to detect clicks outside of a specified element.
 */
export function useClickOutside(
  target: ElementTarget,
  handler: UseClickOutsideHandler,
  options: UseClickOutsideOptions = {},
): void {
  const { ignore = [] } = options
  const el = useTargetElement(target)
  const latest = useLatest({ ignore, handler })

  const shouldIgnore = useStableFn((evt: MouseEvent | PointerEvent) => {
    const elements = latest.current.ignore
      .flatMap((el) => (isString(el) ? Array.from(document.querySelectorAll(el)) : el))
      .map(normalizeElement)
      .filter(notNullish)
      .filter(Boolean)

    return elements.some((el) => evt.target === el || evt.composedPath().includes(el))
  })

  const listener = useStableFn((evt: MouseEvent | PointerEvent) => {
    const isNoElement = !el.current
    const isInPath = el.current && (evt.target === el.current || evt.composedPath().includes(el.current))
    const isIgnored = shouldIgnore(evt)

    if (isNoElement || isInPath || isIgnored) return

    latest.current.handler(evt)
  })

  useEventListener(() => window, 'click', listener, { passive: true, capture: true })
}
