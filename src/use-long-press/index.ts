import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'

import type { ElementTarget } from '../use-target-element'
import type { Position, SetTimeoutReturn } from '../utils/basic'

const DEFAULT_DELAY = 500
const DEFAULT_THRESHOLD = 10

export interface UseLongPressModifiers {
  /**
   * Whether to prevent the default behavior of the event
   */
  preventDefault?: boolean
  /**
   * Whether to stop the propagation of the event
   */
  stopPropagation?: boolean
  /**
   * Whether to only trigger the event once
   */
  once?: boolean
  /**
   * Whether to capture the event
   */
  capture?: boolean
  /**
   * Whether to only trigger the event on the target element itself
   */
  self?: boolean
}

export interface UseLongPressOptions {
  /**
   * Time in ms till `longpress` gets called
   *
   * @default 500
   */
  delay?: number
  /**
   * Event modifiers
   */
  modifiers?: UseLongPressModifiers
  /**
   * Allowance of moving distance in pixels,
   * The action will get canceled When moving too far from the pointerdown position.
   *
   * @default 10
   */
  distanceThreshold?: number | false
}

const defaultFalsyState: Pick<UseLongPressReturn, 'isPressed' | 'isLongPressed' | 'isMeetThreshold'> = {
  isPressed: false,
  isLongPressed: false,
  isMeetThreshold: false,
}

export type UseLongPressHandler = (evt: PointerEvent) => void

export interface UseLongPressReturn {
  /**
   * Whether the element is pressed
   */
  isPressed: boolean
  /**
   * Whether the element is long pressed
   */
  isLongPressed: boolean
  /**
   * Whether the element is meet the threshold
   */
  isMeetThreshold: boolean
  /**
   * Stop the long press event
   */
  stop(): void
}

export function useLongPress(
  target: ElementTarget,
  handler?: UseLongPressHandler,
  options?: UseLongPressOptions,
): UseLongPressReturn {
  const el = useTargetElement(target)
  const timeout = useRef<SetTimeoutReturn | null>(null)
  const posStart = useRef<Position | undefined>()
  const [state, setState] = useSetState({ ...defaultFalsyState }, { deep: true })

  const latest = useLatest({
    handler: (e: PointerEvent) => {
      handler?.(e)
      setState({ isLongPressed: true })
    },
  })

  function clearTimer() {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
      timeout.current = null
    }
    posStart.current = undefined
  }

  function reset() {
    clearTimer()
    setState({ ...defaultFalsyState })
  }

  function onDown(ev: PointerEvent) {
    if (options?.modifiers?.self && ev.target !== el.current) return

    clearTimer()

    if (options?.modifiers?.preventDefault) ev.preventDefault()
    if (options?.modifiers?.stopPropagation) ev.stopPropagation()

    setState({ isPressed: true })

    posStart.current = { x: ev.x, y: ev.y }
    timeout.current = window.setTimeout(() => latest.current.handler(ev), options?.delay ?? DEFAULT_DELAY)
  }

  function onMove(ev: PointerEvent) {
    if (options?.modifiers?.self && ev.target !== el.current) return
    if (!posStart.current || options?.distanceThreshold === false) return
    if (options?.modifiers?.preventDefault) ev.preventDefault()
    if (options?.modifiers?.stopPropagation) ev.stopPropagation()

    const dx = ev.x - posStart.current?.x
    const dy = ev.y - posStart.current?.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance >= (options?.distanceThreshold ?? DEFAULT_THRESHOLD)) {
      clearTimer()
      setState({ isMeetThreshold: true })
    } else {
      setState({ isMeetThreshold: false })
    }
  }

  const evtOptions = {
    capture: options?.modifiers?.capture,
    once: options?.modifiers?.once,
  }

  const cleanups = useLatest([
    useEventListener(el, ['pointerup', 'pointerleave'], reset, evtOptions),
    useEventListener(el, 'pointerdown', onDown, evtOptions),
    useEventListener(el, 'pointermove', onMove, evtOptions),
  ])

  const stop = useStableFn(() => {
    for (const cleanup of cleanups.current) cleanup()
  })

  return {
    ...state,
    stop,
  }
}
