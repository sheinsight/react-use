import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'
import { useTrackedRefState } from '../use-tracked-ref-state'
import { useUpdateEffect } from '../use-update-effect'
import { useVersionedAction } from '../use-versioned-action'

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
   *
   * @deprecated use `loading` instead
   */
  isLoading: boolean
  /**
   * Loading state
   *
   * @since 1.7.0
   */
  loading: boolean
  /**
   * Load done state
   */
  isLoadDone: boolean
  /**
   * Load more function
   *
   * @since 1.7.0
   */
  loadMore: () => Promise<void>
  /**
   * Calculate the current scroll position to determine whether to load more
   */
  calculate(): void
  /**
   * Reset the state to the initial state.
   *
   * @since 1.7.0
   */
  reset(): void
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
  const isCalculating = useRef(false)
  const previousReturn = useRef<R | undefined>(undefined)
  const [incVersion, runVersionedAction] = useVersionedAction()
  const [state, { updateRefState }, stateRef] = useTrackedRefState({
    version: 0,
    loading: false,
    isLoadDone: false,
  })

  const latest = useLatest({ state, canLoadMore, direction, onScroll, onLoadMore, interval })

  const loadMore = useStableFn(async () => {
    if (stateRef.isLoadDone.value || stateRef.loading.value) return

    const version = incVersion()
    updateRefState('loading', true)

    const [result, _] = await Promise.all([
      latest.current.onLoadMore(previousReturn.current),
      new Promise((resolve) => setTimeout(resolve, latest.current.interval)),
    ])

    runVersionedAction(version, () => {
      isCalculating.current = false
      previousReturn.current = result
      updateRefState('loading', false)
      updateRefState('isLoadDone', !latest.current.canLoadMore(previousReturn.current))
    })
  })

  const calculate = useStableFn(async () => {
    if (!el.current || stateRef.isLoadDone.value || stateRef.loading.value) return

    if (isCalculating.current) return

    isCalculating.current = true

    const { scrollHeight, scrollTop, clientHeight, scrollWidth, clientWidth } = el.current

    const isYScroll = latest.current.direction === 'bottom' || latest.current.direction === 'top'
    const isScrollNarrower = isYScroll ? scrollHeight <= clientHeight : scrollWidth <= clientWidth

    const isAlmostBottom = isYScroll
      ? scrollHeight - scrollTop <= clientHeight + distance
      : scrollWidth - scrollTop <= clientWidth + distance

    if (isScrollNarrower || isAlmostBottom) {
      await loadMore()
    }

    isCalculating.current = false
  })

  useMount(immediate && calculate)

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to detect `isLoadDone` change
  useUpdateEffect(() => {
    calculate()
  }, [state.isLoadDone, state.loading, state.version])

  useEventListener(
    el,
    'scroll',
    (event) => {
      calculate()
      latest.current.onScroll?.(event)
    },
    { passive: true },
  )

  const reset = useStableFn(() => {
    previousReturn.current = undefined
    isCalculating.current = false
    incVersion()
    updateRefState('loading', false)
    updateRefState('isLoadDone', false)
    updateRefState('version', stateRef.version.value + 1)
  })

  return {
    get isLoadDone() {
      return state.isLoadDone
    },
    get loading() {
      return state.loading
    },
    get isLoading() {
      return state.loading
    },
    loadMore,
    reset,
    calculate,
  }
}
