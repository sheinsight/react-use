import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRafState } from '../use-raf-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { UseScrollOptions } from '../use-scroll'
import type { ElementTarget } from '../use-target-element'

export interface UseInfiniteScrollOptions<R> extends UseScrollOptions {
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
}

export interface UseInfiniteScrollReturn {
  /**
   * loading state
   */
  isLoading: boolean
  /**
   * load done state
   */
  isLoadDone: boolean
  /**
   * calculate the current scroll position to determine whether to load more
   */
  calculate(): void
}

// biome-ignore lint/suspicious/noExplicitAny: need any
export function useInfiniteScroll<R = any, T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  onLoadMore: (previousReturn: R | undefined) => R | Promise<R>,
  options: UseInfiniteScrollOptions<R> = {},
): UseInfiniteScrollReturn {
  const { direction = 'bottom', immediate = true, interval = 100, canLoadMore = () => true, distance = 100 } = options

  const el = useTargetElement<T>(target)
  const previousReturn = useRef<R | undefined>(undefined)
  const [state, setState] = useRafState({ isLoading: false, isLoadDone: false }, { deep: true })
  const latest = useLatest({ state, direction, onLoadMore, interval })

  const calculate = useStableFn(async () => {
    const { state, direction, onLoadMore, interval } = latest.current

    if (!canLoadMore(previousReturn.current)) {
      return setState({ ...state, isLoadDone: true })
    }

    if (!el.current) return

    const { scrollHeight, scrollTop, clientHeight, scrollWidth, clientWidth } = el.current

    const isYScroll = direction === 'bottom' || direction === 'top'
    const isScrollNarrower = isYScroll ? scrollHeight <= clientHeight : scrollWidth <= clientWidth
    const isAlmostBottom = scrollHeight - scrollTop <= clientHeight + distance

    if (state.isLoading) return

    if (!isScrollNarrower && !isAlmostBottom) return

    setState({ ...state, isLoading: true })

    const [res, _] = await Promise.all([
      onLoadMore(previousReturn.current),
      new Promise((resolve) => window.setTimeout(resolve, interval)),
    ])

    setState({ ...latest.current.state, isLoading: false })

    previousReturn.current = res
  })

  useMount(immediate && calculate)

  useEventListener(el, 'scroll', calculate, { passive: true })

  return {
    ...state,
    calculate,
  }
}
