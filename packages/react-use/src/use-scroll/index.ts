import { useRef } from 'react'
import { useDebouncedFn } from '../use-debounced-fn'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useRafState } from '../use-raf-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'
import { useThrottledFn } from '../use-throttled-fn'

import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'

export type Directions = {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

export type ArrivedState = Directions
export type Insets = { [K in keyof Directions]?: number }
export type UseScrollOptionsOffset = Insets

export interface UseScrollOptions {
  /**
   * The throttle time (ms) to update the scroll position
   */
  throttle?: number
  /**
   * The idle time (ms) to determine the scroll is stopped
   */
  idle?: number
  /**
   * The offset to determine the scroll has arrived at the edge
   */
  offset?: UseScrollOptionsOffset
  /**
   * The scroll event handler
   */
  onScroll?: (event: Event) => void
  /**
   * The scroll stop event handler
   */
  onStop?: (event: Event) => void
  /**
   * The event listener options
   */
  eventListenerOptions?: boolean | AddEventListenerOptions
  /**
   * The scroll behavior
   */
  behavior?: ScrollBehavior
  /**
   * Whether to trigger the first load immediately
   */
  immediate?: boolean
}

export interface UseScrollReturns extends Pausable {
  /**
   * scroll x position
   */
  x: number
  /**
   * scroll y position
   */
  y: number
  /**
   * The scroll position
   */
  position: { x: number; y: number }
  /**
   * The scroll directions
   */
  directions: Directions
  /**
   * Whether the scroll is scrolling
   */
  isScrolling: boolean
  /**
   * The arrived state
   */
  arrivedState: ArrivedState
  /**
   * Scroll to the specified position
   */
  scrollTo: (x: number, y: number) => void
  /**
   * Scroll to the end of the specified direction
   */
  scrollToEnd: (direction: 'x' | 'y') => void
  /**
   * Measure the scroll position
   */
  measure(): void
}

const INIT_DIRECTIONS = { left: false, right: false, top: false, bottom: false }
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

/**
 * A React Hook that track the scroll state of target element.
 */
export function useScroll<T extends HTMLElement>(
  target: ElementTarget<T>,
  options: UseScrollOptions = {},
): UseScrollReturns {
  const {
    throttle = 0,
    idle = 200,
    offset = {},
    onScroll,
    onStop,
    immediate = true,
    eventListenerOptions = { capture: false, passive: true },
    behavior = 'auto',
  } = options

  const isScrollingRef = useRef(false)
  const el = useTargetElement<T>(target)
  const pausable = usePausable(immediate)

  const [state, setState] = useRafState({
    position: { x: 0, y: 0 },
    directions: { ...INIT_DIRECTIONS },
    isScrolling: false,
    arrivedState: { ...INIT_DIRECTIONS, left: true, top: true },
  })

  const latest = useLatest({ state, offset, onStop, onScroll, behavior })

  const scrollTo = useStableFn((x: number, y: number) => {
    const { behavior } = latest.current
    el.current?.scrollTo({ left: x, top: y, behavior })
  })

  const onScrollEnd = useStableFn((e: Event) => {
    const { state, onStop } = latest.current
    if (!state.isScrolling || !pausable.isActive()) return

    isScrollingRef.current = false

    setState((pre) => ({
      ...pre,
      isScrolling: false,
      directions: { ...INIT_DIRECTIONS },
    }))

    onStop?.(e)
  })

  const onScrollEndDebounced = useDebouncedFn(onScrollEnd, { wait: throttle + idle })

  function calcAndSetArrivedState() {
    const { offset, state } = latest.current

    if (!el.current) return

    const { display, flexDirection } = window.getComputedStyle(el.current)
    const scrollLeft = el.current.scrollLeft

    const left = Math.abs(scrollLeft) <= (offset.left || 0)
    const right =
      Math.abs(scrollLeft) + el.current.clientWidth >=
      el.current.scrollWidth - (offset.right || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    const scrollTop = el.current.scrollTop

    const top = Math.abs(scrollTop) <= (offset.top || 0)
    const bottom =
      Math.abs(scrollTop) + el.current.clientHeight >=
      el.current.scrollHeight - (offset.bottom || 0) - ARRIVED_STATE_THRESHOLD_PIXELS

    const isFlexRowReverse = display === 'flex' && flexDirection === 'row-reverse'
    const isFlexColumnReverse = display === 'flex' && flexDirection === 'column-reverse'

    setState({
      isScrolling: isScrollingRef.current,
      position: { x: scrollLeft, y: scrollTop },
      directions: {
        left: scrollLeft < state.position.x,
        right: scrollLeft > state.position.x,
        top: scrollTop < state.position.y,
        bottom: scrollTop > state.position.y,
      },
      arrivedState: {
        left: isFlexRowReverse ? right : left,
        right: isFlexRowReverse ? left : right,
        top: isFlexColumnReverse ? bottom : top,
        bottom: isFlexColumnReverse ? top : bottom,
      },
    })
  }

  const scrollToEnd = useStableFn((direction: 'x' | 'y') => {
    if (!el.current) return

    if (direction === 'x') {
      scrollTo(el.current.scrollWidth, 0)
    } else {
      scrollTo(0, el.current.scrollHeight)
    }
  })

  function onScrollHandler(event: Event) {
    const { onScroll } = latest.current

    if (!el.current || !pausable.isActive()) return

    isScrollingRef.current = true

    calcAndSetArrivedState()
    onScrollEndDebounced(event)
    onScroll?.(event)
  }

  const onScrollHandlerThrottled = useThrottledFn(onScrollHandler, { wait: throttle })
  const measure = useStableFn(() => el.current && calcAndSetArrivedState())

  useEventListener(el, 'scroll', throttle ? onScrollHandlerThrottled : onScrollHandler, eventListenerOptions)
  useEventListener(el, 'scrollend', onScrollEnd, eventListenerOptions)

  return {
    ...state.position,
    ...state,
    ...pausable,
    scrollTo,
    scrollToEnd,
    measure,
  }
}
