import { useRef } from 'react'
import { useCreation } from '../use-creation'
import { useElementSize } from '../use-element-size'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'
import { useUpdateEffect } from '../use-update-effect'
import { isNumber } from '../utils/basic'

import type { CSSProperties } from 'react'
import type { ElementTarget } from '../use-target-element'

interface UseVirtualListBaseOptions {
  /**
   * The ElementTarget that should be used as the container. Usually, it should be scrollable (overflow scroll).
   */
  containerTarget: NonNullable<ElementTarget<HTMLElement>>
  /**
   * The ElementTarget that should be used as the wrapper, which contains the list of items directly.
   *
   * The margin and height (width for horizontal) of the wrapper element will be set to the total height (width) of all items.
   */
  wrapperTarget: NonNullable<ElementTarget<HTMLElement>>
  /**
   * The number of items that should be rendered in the viewport.
   *
   * @defaultValue 5
   */
  overscan?: number
}

interface UseVerticalVirtualListOptions<D> extends UseVirtualListBaseOptions {
  /**
   * The height of each item, or a function that returns the height of each item.
   *
   * When `itemHeight` is set, the list will be rendered vertically.
   */
  itemHeight: number | ((index: number, item: D) => number)
}

interface UseHorizontalVirtualListOptions<D> extends UseVirtualListBaseOptions {
  /**
   * The width of each item, or a function that returns the width of each item.
   *
   * When `itemWidth` is set and `itemHeight` is not set, the list will be rendered horizontally.
   */
  itemWidth: number | ((index: number, item: D) => number)
}

export type UseVirtualListOptions<D> = UseVerticalVirtualListOptions<D> | UseHorizontalVirtualListOptions<D>

export interface UseVirtualListReturnsActions {
  /**
   * Scroll to the item at the specified index, automatically use vertical or horizontal scrolling based on the options.
   *
   * @param {Number} index The index of the item to scroll to.
   */
  scrollTo: (index: number) => void
  /**
   * Scroll to the start of the list, automatically use vertical or horizontal scrolling based on the options.
   */
  scrollToStart: () => void
  /**
   * Scroll to the end of the list, automatically use vertical or horizontal scrolling based on the options.
   */
  scrollToEnd: () => void
}

export interface UseVirtualListReturnsListItem<D> {
  /**
   * The data of the item.
   */
  data: D
  /**
   * The index of the item.
   */
  index: number
}

export type UseVirtualListReturns<D> = readonly [
  /**
   * The list of items that should be rendered.
   */
  list: UseVirtualListReturnsListItem<D>[],
  /**
   * The actions that can be used to control the list.
   */
  UseVirtualListReturnsActions,
]

export function useVirtualList<D = any>(list: D[], options: UseVirtualListOptions<D>): UseVirtualListReturns<D> {
  const overscanCount = options.overscan ?? 5
  const isVerticalLayout = 'itemHeight' in options
  const itemSize = isVerticalLayout ? options.itemHeight : options.itemWidth

  const containerRef = useTargetElement<HTMLElement>(options.containerTarget)
  const wrapperRef = useTargetElement<HTMLElement>(options.wrapperTarget)
  const containerSize = useElementSize(containerRef)

  const [wrapperStyle, setWrapperStyle] = useSafeState<CSSProperties>({})
  const [renderList, setRenderList] = useSafeState<{ data: D; index: number }[]>([])

  const isTriggeredInternallyRef = useRef(false)

  function findMatchedIdx(
    condition: (sum: number) => boolean,
    itemSize: (index: number, item: D) => number,
    fromIdx: number = 0,
  ) {
    let sum = 0
    let idx = fromIdx
    for (let i = fromIdx; i < list.length; i++) {
      const height = itemSize(i, list[i])
      sum += height
      if (condition(sum)) {
        idx = i
        break
      }
    }
    return idx
  }

  function getOffsetIdx(scrollPosition: number) {
    if (isNumber(itemSize)) return Math.floor(scrollPosition / itemSize)
    const offsetIdx = findMatchedIdx((sum) => sum >= scrollPosition, itemSize)
    return offsetIdx + 1
  }

  function getVisibleItemCount(containerSize: number, startIdx: number) {
    if (isNumber(itemSize)) return Math.ceil(containerSize / itemSize)
    const endIdx = findMatchedIdx((sum) => sum >= containerSize, itemSize, startIdx)
    return endIdx - startIdx
  }

  function getOffsetSize(idx: number) {
    if (isNumber(itemSize)) return idx * itemSize
    return list.slice(0, idx).reduce((sum, _, i) => sum + itemSize(i, list[i]), 0)
  }

  const totalSize = useCreation(() => getOffsetSize(list.length), [list])

  function calculateVirtualOffset() {
    const containerEl = containerRef.current
    const wrapperEl = wrapperRef.current

    if (!containerEl || !wrapperEl) return

    const { scrollTop, scrollLeft, clientHeight, clientWidth } = containerEl

    const offsetIdx = getOffsetIdx(isVerticalLayout ? scrollTop : scrollLeft)
    const visibleCount = getVisibleItemCount(isVerticalLayout ? clientHeight : clientWidth, offsetIdx)

    const renderStartIdx = Math.max(0, offsetIdx - overscanCount)
    const renderEndIdx = Math.min(list.length, offsetIdx + visibleCount + overscanCount)

    const offsetSize = getOffsetSize(renderStartIdx)

    const renderList = list.slice(renderStartIdx, renderEndIdx).map((item, index) => ({
      data: item,
      index: index + renderStartIdx,
    }))

    setWrapperStyle({
      // [isVerticalLayout ? 'width' : 'height']: '100%',
      [isVerticalLayout ? 'height' : 'width']: `${totalSize - offsetSize}px`,
      [isVerticalLayout ? 'marginTop' : 'marginLeft']: `${offsetSize}px`,
    })

    setRenderList(renderList)
  }

  const latest = useLatest({
    list,
    itemSize,
    getOffsetSize,
    calculateVirtualOffset,
  })

  useEventListener(containerRef, 'scroll', () => {
    if (isTriggeredInternallyRef.current) {
      isTriggeredInternallyRef.current = false
      return
    }

    calculateVirtualOffset()
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: The effect should only run when the container size changes.
  useUpdateEffect(() => void calculateVirtualOffset(), [containerSize.height, containerSize.width, list])

  // biome-ignore lint/correctness/useExhaustiveDependencies: The effect should only run when wrapper styles change.
  useUpdateEffect(() => {
    if (!wrapperRef.current) return
    for (const key of Object.keys(wrapperStyle)) {
      wrapperRef.current.style[key as never] = wrapperStyle[key as never]
    }
  }, [wrapperStyle])

  const scrollTo = useStableFn((index: number) => {
    const containerEl = containerRef.current
    if (!containerEl) return

    isTriggeredInternallyRef.current = true

    const offsetSize = isNumber(latest.current.itemSize)
      ? index * latest.current.itemSize
      : latest.current.getOffsetSize(index)

    containerEl[isVerticalLayout ? 'scrollTop' : 'scrollLeft'] = offsetSize

    // Manually trigger the `calculateVirtualOffset` instantly, use ref to mark the manual trigger,
    // because subscription of `useEventListener` will not be triggered in the same frame.
    // This is useful to prevent layout jittering when scrolling.
    latest.current.calculateVirtualOffset()
  })

  const scrollToStart = useStableFn(() => scrollTo(0))
  const scrollToEnd = useStableFn(() => scrollTo(latest.current.list.length - 1))

  const actions = useCreation(() => ({ scrollTo, scrollToStart, scrollToEnd }))

  return [renderList, actions] as const
}
