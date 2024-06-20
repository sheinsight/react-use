import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useSupported } from '../use-supported'
import { notNullish } from '../utils/basic'

import type { UseIntervalFnInterval } from '../use-interval-fn'
import type { Pausable } from '../use-pausable'
import type { Position } from '../utils/basic'

export interface UseElementByPointReturns<E extends Element | Element[]> extends Pausable {
  /**
   * Whether the browser supports the API
   */
  isSupported: boolean
  /**
   * The element at the specified position
   */
  element: E | null
}

export interface UseElementByPointOptions<M extends boolean = false> extends Position {
  /**
   * Whether to return multiple elements
   *
   * @defaultValue false
   */
  multiple?: M
  /**
   * Whether to execute immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * The interval to execute
   *
   * @defaultValue 'requestAnimationFrame'
   */
  interval?: UseIntervalFnInterval
}

export function useElementByPoint<
  M extends boolean = false,
  E extends Element | Element[] = M extends true ? Element[] : Element,
>(options: UseElementByPointOptions<M>): UseElementByPointReturns<E> {
  const { x, y, multiple = false, interval = 'requestAnimationFrame', immediate = true } = options
  const [element, setElement] = useSafeState<E | null>(null)
  const latest = useLatest({ x, y, multiple })

  // https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint#browser_compatibility
  const isSupported = useSupported(() => (multiple ? 'elementsFromPoint' : 'elementFromPoint') in document, [multiple])

  const controls = useIntervalFn(
    () => {
      if (!isSupported) return
      const { x, y, multiple } = latest.current
      const result = document?.[multiple ? 'elementsFromPoint' : 'elementFromPoint'](x, y)
      const element = (Array.isArray(result) ? result.filter(notNullish) : result) as E
      setElement(element ?? (multiple ? [] : null))
    },
    interval,
    { immediate },
  )

  return {
    isSupported,
    element,
    ...controls,
  }
}
