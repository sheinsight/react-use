import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useIsomorphicLayoutEffect } from '../use-isomorphic-layout-effect'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { DependencyList } from 'react'
import type { ElementTarget } from '../use-target-element'

export interface UseAdaptiveTextareaOptions<T extends HTMLElement = HTMLElement> {
  /**
   * a list of dependencies to trigger the resize
   *
   * @default []
   */
  watch?: DependencyList
  /**
   * a list of events to trigger the resize
   *
   * @default ['input']
   */
  events?: (keyof HTMLElementEventMap)[]
  /**
   * whether to automatically adjust the height of the `textarea` element
   *
   * @default true
   */
  autoHeight?: boolean
  /**
   * a target element to apply the height style
   *
   * @default undefined
   */
  styleTarget?: ElementTarget<T>
  /**
   * a style property to apply the height value
   *
   * @default 'height'
   */
  styleProp?: 'height' | 'minHeight'
  /**
   * a callback function to be called when the height of the `textarea` element changes
   *
   * @default undefined
   */
  onResize?: (height: number, prevHeight: number) => void
}

export interface UseAdaptiveTextareaReturn {
  /**
   * a React ref that should be passed to the `textarea` element
   */
  ref: React.RefObject<HTMLTextAreaElement>
  /**
   * the current height of the `textarea` element
   */
  height: number
  /**
   * a function to manually resize the `textarea` element
   */
  resize(): void
}

/**
 * Automatically adjust the height of a `textarea` element based on its content
 *
 * @tip set `rows={1}` attribute & `resize: none` style to the `textarea` before using this Hook
 */
export function useAdaptiveTextarea<T extends HTMLElement>(
  options: UseAdaptiveTextareaOptions<T> = {},
): UseAdaptiveTextareaReturn {
  const { onResize, events = ['input'], autoHeight = true, watch = [], styleTarget, styleProp = 'height' } = options

  const taRef = useRef<HTMLTextAreaElement>(null)
  const target = useTargetElement<T>(styleTarget)
  const [height, setHeight] = useSafeState(0)
  const latest = useLatest({ height, onResize, styleProp })

  const resize = useStableFn(() => {
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
