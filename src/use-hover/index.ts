import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'

export interface UseHoverOptions {
  /**
   * Delay in milliseconds before the `onEnter` event is triggered
   */
  delayEnter?: number
  /**
   * Delay in milliseconds before the `onLeave` event is triggered
   */
  delayLeave?: number
  /**
   * Event handler when the mouse enters the target element
   */
  onEnter?: (e: MouseEvent) => void
  /**
   * Event handler when the mouse leaves the target element
   */
  onLeave?: (e: MouseEvent) => void
  /**
   * Event handler when the mouse enters or leaves the target element
   */
  onChange?: (isHovered: boolean, e: MouseEvent) => void
}

export function useHover<T extends HTMLElement = HTMLElement>(
  target: ElementTarget<T>,
  options: UseHoverOptions = {},
): boolean {
  const latest = useLatest(options)
  const el = useTargetElement<T>(target)
  const [isHovered, setIsHovered] = useSafeState(false)

  useEventListener(el, 'mouseenter', (e) => {
    const { delayEnter = 0 } = options

    const trigger = () => {
      setIsHovered(true)
      latest.current.onEnter?.(e)
      latest.current.onChange?.(true, e)
    }

    if (delayEnter <= 0) {
      trigger()
    } else {
      setTimeout(() => trigger(), delayEnter)
    }
  })

  useEventListener(el, 'mouseleave', (e) => {
    const { delayLeave = 0 } = options

    const trigger = () => {
      setIsHovered(false)
      latest.current.onLeave?.(e)
      latest.current.onChange?.(false, e)
    }

    if (delayLeave <= 0) {
      trigger()
    } else {
      setTimeout(() => trigger(), delayLeave)
    }
  })

  return isHovered
}
