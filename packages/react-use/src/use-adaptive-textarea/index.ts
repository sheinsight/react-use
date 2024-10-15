import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { DependencyList, RefObject } from 'react'
import type { ElementTarget } from '../use-target-element'

export interface UseAdaptiveTextareaOptions<T extends HTMLElement = HTMLElement> {
  /**
   * a list of dependencies to trigger the resize
   *
   * @defaultValue []
   */
  watch?: DependencyList
  /**
   * a list of events to trigger the resize
   *
   * @defaultValue ['input']
   */
  events?: (keyof HTMLElementEventMap)[]
  /**
   * whether to automatically adjust the height of the `textarea` element
   *
   * @defaultValue true
   */
  autoHeight?: boolean
  /**
   * a target element to apply the height style
   *
   * @defaultValue undefined
   */
  styleTarget?: ElementTarget<T>
  /**
   * a style property to apply the height value
   *
   * @defaultValue 'height'
   */
  styleProp?: 'height' | 'minHeight'
  /**
   * a callback function to be called when the height of the `textarea` element changes
   *
   * @defaultValue undefined
   */
  onResize?: (height: number, prevHeight: number) => void
}

export interface UseAdaptiveTextareaReturns {
  /**
   * a React ref that should be passed to the `textarea` element
   */
  ref: RefObject<HTMLTextAreaElement>
  /**
   * the current height of the `textarea` element
   */
  height: number
  /**
   * a function to manually resize the `textarea` element
   *
   * @returns {void} `void`
   */
  resize(): void
}

/**
 * A React Hook that helps to create **adaptive** textarea that automatically adjust height based on its content.
 *
 * @param {UseAdaptiveTextareaOptions} options - `UseAdaptiveTextareaOptions`, see {@link UseAdaptiveTextareaOptions}
 * @returns {UseAdaptiveTextareaReturns} `UseAdaptiveTextareaReturns`, see {@link UseAdaptiveTextareaReturns}
 */
export function useAdaptiveTextarea<T extends HTMLElement>(
  options: UseAdaptiveTextareaOptions<T> = {},
): UseAdaptiveTextareaReturns {
  const { onResize, events = ['input'], autoHeight = true, watch = [], styleTarget, styleProp = 'height' } = options

  const taRef = useRef<HTMLTextAreaElement>(null)
  const target = useTargetElement<T>(styleTarget)
  const [height, setHeight] = useSafeState(0)
  const latest = useLatest({ height, onResize, styleProp })

  const resize = useStableFn(() => {
    /* v8 ignore next 35, it has been tested in Cypress  */
    if (!taRef.current) return

    const { onResize, styleProp, height } = latest.current

    const style = window.getComputedStyle(taRef.current)

    const paddingTop = Number.parseFloat(style.paddingTop)
    const paddingBottom = Number.parseFloat(style.paddingBottom)
    const borderTop = Number.parseFloat(style.borderTopWidth)
    const borderBottom = Number.parseFloat(style.borderBottomWidth)

    // border-box includes padding and border in the height
    const isBorderBox = style.boxSizing === 'border-box'
    const offset = isBorderBox ? -(borderTop + borderBottom) : paddingTop + paddingBottom

    const prevHeight = taRef.current.style[styleProp]

    // this is to force the scrollHeight to be calculated correctly
    taRef.current.style[styleProp] = '1px'

    const nextHeight = taRef.current.scrollHeight - offset

    if (target.current) {
      target.current.style[styleProp] = `${nextHeight}px`
      taRef.current.style[styleProp] = prevHeight
    } else if (autoHeight) {
      taRef.current.style[styleProp] = `${nextHeight}px`
    } else {
      taRef.current.style[styleProp] = prevHeight
    }

    if (nextHeight === height) return

    setHeight(nextHeight)
    onResize?.(nextHeight, height)
  })

  // use `useLayoutEffect` to prevent layout jitter
  useIsomorphicLayoutEffect(() => resize(), watch)

  useEventListener(taRef, events, resize)

  return {
    ref: taRef,
    height,
    resize,
  }
}
