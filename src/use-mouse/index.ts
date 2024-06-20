import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { usePausable } from '../use-pausable'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { isDefined, isFunction } from '../utils/basic'

import type { Pausable } from '../use-pausable'
import type { Position } from '../utils/basic'

export type UseMouseCoordType = 'page' | 'client' | 'screen' | 'movement'
export type UseMouseSourceType = 'mouse' | 'touch' | null
export type UseMouseEventExtractor = (event: MouseEvent | Touch) => [x: number, y: number] | null | undefined

export interface UseMouseOptions {
  /**
   * Type of coordinates to extract from the event.
   *
   * @defaultValue 'page'
   */
  type?: UseMouseCoordType | UseMouseEventExtractor
  /**
   * Target element to attach the event listeners.
   *
   * @defaultValue window
   */
  target?: Window | EventTarget | null | undefined
  /**
   * Whether to enable touch events.
   *
   * @defaultValue true
   */
  touch?: boolean
  /**
   * Whether to enable scroll events.
   *
   * @defaultValue true
   */
  scroll?: boolean
  /**
   * Whether to reset the position when touch ends.
   *
   * @defaultValue false
   */
  resetOnTouchEnds?: boolean
  /**
   * Initial position.
   *
   * @defaultValue { x: 0, y: 0 }
   */
  initialValue?: Position
  /**
   * Whether to start to update position immediately.
   *
   * @defaultValue false
   */
  immediate?: boolean
}

const UseMouseBuiltinExtractors: Record<UseMouseCoordType, UseMouseEventExtractor> = {
  page: (event) => [event.pageX, event.pageY],
  client: (event) => [event.clientX, event.clientY],
  screen: (event) => [event.screenX, event.screenY],
  movement: (event) => {
    if (!isDefined(Touch)) {
      return 'movementX' in event ? [event.movementX, event.movementY] : null
    }
    return event instanceof Touch ? null : [event.movementX, event.movementY]
  },
}

export interface UseMouseReturns extends Position, Pausable {
  /**
   * mouse event position.
   */
  position: Position
  /**
   * Source type of the event.
   */
  sourceType: UseMouseSourceType
  /**
   * stop the mouse event listener immediately.
   */
  stop(): void
}

export function useMouse(options: UseMouseOptions = {}): UseMouseReturns {
  const {
    type = 'page',
    touch = true,
    immediate = true,
    resetOnTouchEnds = false,
    initialValue = { x: 0, y: 0 },
    target = () => window,
    scroll = true,
  } = options

  const pausable = usePausable(immediate)
  const preMouseEventRef = useRef<MouseEvent | null>(null)
  const [position, setPosition] = useSafeState(initialValue)
  const [sourceType, setSourceType] = useSafeState<UseMouseSourceType>(null)

  const extractor = isFunction(type) ? type : UseMouseBuiltinExtractors[type]

  function mouseHandler(event: MouseEvent) {
    const result = extractor(event)
    preMouseEventRef.current = event

    if (result && pausable.isActive()) {
      setPosition({ x: result[0], y: result[1] })
      setSourceType('mouse')
    }
  }

  function touchHandler(event: TouchEvent) {
    if (!event.touches.length) return
    const result = extractor(event.touches[0])
    if (result && pausable.isActive()) {
      setPosition({ x: result[0], y: result[1] })
      setSourceType('touch')
    }
  }

  function scrollHandler() {
    if (!preMouseEventRef.current) return

    const position = extractor(preMouseEventRef.current)
    const isMouseEvent = preMouseEventRef.current instanceof MouseEvent

    if (isMouseEvent && position && pausable.isActive()) {
      setPosition({ x: position[0] + window.scrollX, y: position[1] + window.scrollY })
    }
  }

  const isTouch = touch && type !== 'movement'
  const isScroll = scroll && type === 'page'
  const resetOnEnds = isTouch && resetOnTouchEnds
  const evtOptions = { passive: true }

  const cleanups = useLatest([
    useEventListener(target, ['mousemove', 'dragover'], mouseHandler, evtOptions),
    useEventListener(target, isTouch ? ['touchstart', 'touchmove'] : [], touchHandler, evtOptions),
    useEventListener(
      target,
      resetOnEnds ? 'touchend' : [],
      () => {
        pausable.isActive() && setPosition(initialValue)
      },
      evtOptions,
    ),
    useEventListener(() => window, isScroll ? 'scroll' : [], scrollHandler, evtOptions),
  ])

  const stop = useStableFn(() => {
    for (const cleanup of cleanups.current) cleanup()
  })

  return {
    ...position,
    ...pausable,
    position,
    sourceType,
    stop,
  }
}
