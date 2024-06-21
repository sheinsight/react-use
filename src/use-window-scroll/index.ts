import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useMutationObserver } from '../use-mutation-observer'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'

import type { Position } from '../utils/basic'

export interface UseWindowScrollOptions {
  /**
   * The scroll behavior, set to 'smooth' to enable smooth scrolling.
   *
   * @defaultValue 'auto'
   */
  behavior?: ScrollBehavior
}

export interface UseWindowScrollReturns extends Position {
  /**
   * The maximum scroll position on the x-axis.
   */
  maxX: number
  /**
   * The maximum scroll position on the y-axis.
   */
  maxY: number
  /**
   * Scrolls the window to the specified position.
   *
   * @param newPos The new position to scroll to.
   */
  scrollTo(newPos: Partial<Position>): void
  /**
   * Scrolls the window to the top.
   */
  scrollToTop(): void
  /**
   * Scrolls the window to the bottom.
   */
  scrollToBottom(): void
  /**
   * Scrolls the window to the left.
   */
  scrollToLeft(): void
  /**
   * Scrolls the window to the right.
   */
  scrollToRight(): void
}

/**
 * A React Hook that helps to track and manipulate window scroll state.
 */
export function useWindowScroll(options: UseWindowScrollOptions = {}): UseWindowScrollReturns {
  const { behavior = 'auto' } = options

  const [state, setState] = useSetState<Position & { maxX: number; maxY: number }>(
    { x: 0, y: 0, maxX: 0, maxY: 0 },
    { deep: true },
  )

  const latest = useLatest({ behavior, state })

  function updateState() {
    setState(getPositionState())
  }

  useMount(updateState)

  useMutationObserver(() => document.documentElement, updateState, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  })

  useEventListener(() => window, ['scroll', 'resize'], updateState, { capture: false, passive: true })

  const scrollTo = useStableFn((newPos: Partial<Position>) => {
    const { behavior, state: position } = latest.current
    const options = { behavior, left: newPos?.x ?? position.x, top: newPos?.y ?? position.y }
    window.scrollTo(options)
  })

  const scrollToTop = useStableFn(() => scrollTo({ y: 0 }))
  const scrollToBottom = useStableFn(() => scrollTo({ y: latest.current.state.maxY }))
  const scrollToLeft = useStableFn(() => scrollTo({ x: 0 }))
  const scrollToRight = useStableFn(() => scrollTo({ x: latest.current.state.maxX }))

  return {
    ...state,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollToLeft,
    scrollToRight,
  }
}

function getPositionState() {
  return {
    x: window.scrollX,
    y: window.scrollY,
    maxX: document.documentElement.scrollWidth - window.innerWidth,
    maxY: document.documentElement.scrollHeight - window.innerHeight,
  }
}
