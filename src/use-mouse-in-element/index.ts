import { useEffect } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMouse } from '../use-mouse'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { UseMouseOptions, UseMouseReturns } from '../use-mouse'
import type { Pausable } from '../use-pausable'
import type { ElementTarget } from '../use-target-element'

export interface MouseInElementOptions extends UseMouseOptions {
  handleOutside?: boolean
}

export interface UseMouseInElementReturns extends Pausable {
  /**
   * Whether the mouse is outside the element
   */
  isOutside: boolean
  /**
   * The x position of the mouse relative to the element
   */
  elementX: number
  /**
   * The y position of the mouse relative to the element
   */
  elementY: number
  /**
   * The x position of the element
   */
  elementPositionX: number
  /**
   * The y position of the element
   */
  elementPositionY: number
  /**
   * The height of the element
   */
  elementHeight: number
  /**
   * The width of the element
   */
  elementWidth: number
  /**
   * The mouse state
   */
  stop(): void
  /**
   * The mouse state
   */
  mouse: UseMouseReturns
}

/**
 * A React Hook that tracks mouse position in an element.
 */
export function useMouseInElement(
  target: ElementTarget,
  options: MouseInElementOptions = {},
): UseMouseInElementReturns {
  const { handleOutside = true } = options

  const mType = options.type || 'page'

  const [state, setState] = useSetState({
    isOutside: false,
    elementX: 0,
    elementY: 0,
    elementHeight: 0,
    elementWidth: 0,
    elementPositionX: 0,
    elementPositionY: 0,
  })

  const el = useTargetElement(target)

  const { stop: stopMouse, x, y, pause, resume, isActive, ...mouseRest } = useMouse(options)

  useEffect(() => {
    if (!el.current) return

    const { left, top, width, height } = el.current.getBoundingClientRect()

    const elementPositionX = left + (mType === 'page' ? window.scrollX ?? window.pageXOffset : 0)
    const elementPositionY = top + (mType === 'page' ? window.scrollY ?? window.pageYOffset : 0)

    const elX = x - elementPositionX
    const elY = y - elementPositionY

    const isOutside = width === 0 || height === 0 || elX < 0 || elY < 0 || elX > width || elY > height

    const shouldUpdateElementPosition = handleOutside || !isOutside

    setState(({ elementX, elementY }) => ({
      isOutside,
      elementPositionX,
      elementPositionY,
      elementHeight: height,
      elementWidth: width,
      elementX: shouldUpdateElementPosition ? x - elementPositionX : elementX,
      elementY: shouldUpdateElementPosition ? y - elementPositionY : elementY,
    }))
  }, [el.current, x, y, handleOutside, mType])

  const cleanups = useLatest([
    stopMouse,
    useEventListener(
      () => document,
      'mouseleave',
      () => setState({ isOutside: true }),
    ),
  ])

  const stop = useStableFn(() => {
    for (const cleanup of cleanups.current) cleanup()
  })

  const mouse = { x, y, pause, mType, resume, isActive, stop: stopMouse, ...mouseRest }

  return {
    stop,
    pause,
    resume,
    isActive,
    mouse,
    ...state,
  }
}
