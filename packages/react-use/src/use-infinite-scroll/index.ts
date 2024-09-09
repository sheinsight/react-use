import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRafState } from '../use-raf-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export interface UseInfiniteScrollOptions<R> {
  /**
   * Whether to trigger the first load immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
  /**
   * distance from the bottom of the scroll container
   *
   * @defaultValue 0
   */
  distance?: number
  /**
   * scroll direction
   *
   * @defaultValue 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * interval between each scroll event
   *
   * @defaultValue 100
   */
  interval?: number
  /**
   * check if can load more
   */
  canLoadMore?: (previousReturn: R | undefined) => boolean
  /**
   * scroll event callback
   */
  onScroll?: (event: Event) => void
}

export interface UseInfiniteScrollReturns {
  /**
   * Loading state
   */
  isLoading: boolean
  /**
   * Load done state
   */
  isLoadDone: boolean
  /**
   * Calculate the current scroll position to determine whether to load more
   */
  calculate(): void
  /**
   * Reset the state to the initial state.
   *
   * @param {boolean} immediate Whether to trigger the first load immediately, default is true
   *
   * @since 1.7.0
   */
  reset(immediate?: boolean): void
}

/**
 * A React Hook that allows you to use infinite scroll in your components.
 */
export function useInfiniteScroll<R = any, T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  onLoadMore: (previousReturn: R | undefined) => R | Promise<R>,
  options: UseInfiniteScrollOptions<R> = {},
): UseInfiniteScrollReturns {
  const {
    immediate = true,
    distance = 100,
    direction = 'bottom',
    interval = 100,
    canLoadMore = () => true,
    onScroll,
  } = options

  const el = useTargetElement<T>(target)
  const previousReturn = useRef<R | undefined>(undefined)
  const [state, setState] = useRafState({ isLoading: false, isLoadDone: false }, { deep: true })
  const latest = useLatest({ state, canLoadMore, direction, onScroll, onLoadMore, interval })

  const calculate = useStableFn(async () => {
    if (!latest.current.canLoadMore(previousReturn.current)) return

    if (!el.current || latest.current.state.isLoading) return

    const { scrollHeight, scrollTop, clientHeight, scrollWidth, clientWidth } = el.current

    const isYScroll = latest.current.direction === 'bottom' || latest.current.direction === 'top'
    const isScrollNarrower = isYScroll ? scrollHeight <= clientHeight : scrollWidth <= clientWidth

    const isAlmostBottom = isYScroll
      ? scrollHeight - scrollTop <= clientHeight + distance
      : scrollWidth - scrollTop <= clientWidth + distance

    if (isScrollNarrower || isAlmostBottom) {
      setState({ isLoadDone: false, isLoading: true })

      const [result, _] = await Promise.all([
        latest.current.onLoadMore(previousReturn.current),
        new Promise((resolve) => setTimeout(resolve, latest.current.interval)),
      ])

      previousReturn.current = result

      setState({
        isLoadDone: !latest.current.canLoadMore(previousReturn.current),
        isLoading: false,
      })
    }
  })

  useMount(immediate && calculate)

  useEventListener(
    el,
    'scroll',
    (event) => {
      calculate()
      latest.current.onScroll?.(event)
    },
    { passive: true },
  )

  const reset = useStableFn((immediate = true) => {
    previousReturn.current = undefined
    setState({ isLoading: false, isLoadDone: false })
    immediate && calculate()
  })

  return {
    ...state,
    calculate,
    reset,
  }
}
