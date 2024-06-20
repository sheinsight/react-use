import { useEventListener } from '../use-event-listener'
import { useMediaQuery } from '../use-media-query'
import { useMount } from '../use-mount'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'

import type { Size } from '../utils/basic'

export interface UseWindowSizeOptions {
  /**
   * The initial width of the window.
   *
   * @defaultValue Number.POSITIVE_INFINITY
   */
  initialWidth?: number
  /**
   * The initial height of the window.
   *
   * @defaultValue Number.POSITIVE_INFINITY
   */
  initialHeight?: number
  /**
   * Whether to listen to orientation changes.
   *
   * @defaultValue true
   */
  listenOrientation?: boolean
  /**
   * Whether to include the scrollbar width.
   *
   * @defaultValue true
   */
  includeScrollbar?: boolean
}

export interface UseWindowSizeReturns extends Size {
  /**
   * Update the window size.
   */
  update(): void
}

export function useWindowSize(options: UseWindowSizeOptions = {}): UseWindowSizeReturns {
  const {
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true,
  } = options

  const [size, setSize] = useSafeState<Size>({ width: initialWidth, height: initialHeight }, { deep: true })
  const update = useStableFn(() => setSize(getWindowSize(includeScrollbar)))

  useMount(update)

  useEventListener(() => window, 'resize', update, { passive: true })

  const isPortrait = useMediaQuery(listenOrientation ? '(orientation: portrait)' : '')

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when orientation changes
  useUpdateEffect(() => update(), [isPortrait])

  return { ...size, update }
}

function getWindowSize(includeScrollbar = true) {
  const width = includeScrollbar ? window.innerWidth : document.documentElement.clientWidth
  const height = includeScrollbar ? window.innerHeight : document.documentElement.clientHeight
  return { width, height }
}
