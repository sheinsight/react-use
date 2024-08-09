import { useCreation } from '../use-creation'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useSupported } from '../use-supported'
import { useTargetElement } from '../use-target-element'
import { useUnmount } from '../use-unmount'
import { isDefined, isFunction, notNullish } from '../utils/basic'
import { EventHandlerList, getCompatibleAttr } from './compatible-attributes'

import type { ElementTarget } from '../use-target-element'

export interface UseFullscreenOptions {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @defaultValue false
   */
  autoExit?: boolean
}

export interface UseFullscreenReturns {
  /**
   * Whether the browser supports fullscreen API
   */
  isSupported: boolean
  /**
   * Whether the element is in fullscreen mode
   */
  isFullscreen: boolean
  /**
   * Whether the element itself is in fullscreen mode
   */
  isSelfFullscreen: boolean
  /**
   * Enter fullscreen mode
   */
  enter(): Promise<void>
  /**
   * Exit fullscreen mode
   */
  exit(): Promise<void>
  /**
   * Toggle fullscreen mode
   */
  toggle(): Promise<void>
}

/**
 * A React Hook that allows you to use the [requestFullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen) with ease.
 */
export function useFullscreen(
  target: ElementTarget = 'html',
  options: UseFullscreenOptions = {},
): UseFullscreenReturns {
  const { autoExit = false } = options

  const el = useTargetElement(target)
  const [isFullscreen, setIsFullscreen] = useSafeState(false)

  const isSupported = useSupported(() => {
    const attrs = getCompatibleAttr(el.current)
    return Object.values(attrs).every(isDefined)
  }, [el.current])

  const latest = useLatest({ isFullscreen, isSupported })

  const isCurrentElementFullscreen = useStableFn(() => {
    const { fsElement } = getCompatibleAttr(el.current)

    if (fsElement) {
      return Boolean(document && document[fsElement as 'fullscreenElement'] === el.current)
    }

    return false
  })

  const isElementFullscreen = useStableFn(() => {
    const { fsEnabled } = getCompatibleAttr(el.current)

    if (fsEnabled) {
      if (document && notNullish(document[fsEnabled as 'fullscreen'])) {
        return document[fsEnabled as 'fullscreen']
      }
      if (el.current && notNullish(el.current[fsEnabled as never])) {
        return Boolean(el.current[fsEnabled as never])
      }
    }
    return false
  })

  const exit = useStableFn(async () => {
    const { exit } = getCompatibleAttr(el.current)
    const { isFullscreen, isSupported } = latest.current

    if (!el.current || !document || !isSupported || !isFullscreen) return

    if (isFunction(document[exit as 'exitFullscreen'])) {
      await document[exit as 'exitFullscreen']()
    } else {
      if (isFunction(el.current[exit as never])) {
        await (el.current[exit as never] as any)?.()
      }
    }

    setIsFullscreen(false)
  })

  const enter = useStableFn(async () => {
    const { enter } = getCompatibleAttr(el.current)
    const { isFullscreen, isSupported } = latest.current

    if (!el.current || !isSupported || isFullscreen) return
    if (isElementFullscreen()) await exit()

    if (isFunction(el.current[enter as 'requestFullscreen'])) {
      await el.current[enter as 'requestFullscreen']()
      setIsFullscreen(true)
    }
  })

  const toggle = useStableFn(() => (latest.current.isFullscreen ? exit() : enter()))

  const handlerFullscreenChange = useStableFn(() => {
    const isFullscreenValue = isElementFullscreen()

    if (!isFullscreenValue || (isFullscreenValue && isCurrentElementFullscreen())) {
      setIsFullscreen(isFullscreenValue)
    }
  })

  useEventListener(() => document, EventHandlerList, handlerFullscreenChange, false)
  useEventListener(el, EventHandlerList, handlerFullscreenChange, false)

  useUnmount(() => autoExit && exit())

  const isSelfFullscreen = useCreation(() => isFullscreen && isCurrentElementFullscreen(), [isFullscreen])

  return {
    isSupported,
    isFullscreen,
    isSelfFullscreen,
    enter,
    exit,
    toggle,
  }
}
