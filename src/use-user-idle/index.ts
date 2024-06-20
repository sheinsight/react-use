import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { usePausable } from '../use-pausable'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { timestamp } from '../utils/basic'

import type { MutableRefObject } from 'react'
import type { Pausable } from '../use-pausable'
import type { SetTimeoutReturn, WindowEventName } from '../utils/basic'

export interface UseUserIdleOptions {
  /**
   * Event names that listen to for detected user activity
   *
   * @defaultValue ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[]
  /**
   * Listen for document visibility change
   *
   * @defaultValue true
   */
  watchVisibility?: boolean
  /**
   * Initial state of the ref idle
   *
   * @defaultValue false
   */
  initialState?: boolean
  /**
   * Reset the idle state immediately
   *
   * @defaultValue true
   */
  immediate?: boolean
}

export interface UseUserIdleReturns extends Pausable<[reset?: boolean], [reset?: boolean]> {
  /**
   * Whether the user is idle
   */
  isIdle: boolean
  /**
   * The timestamp of the last user activity
   */
  lastActive: MutableRefObject<number>
  /**
   * Reset the idle state
   *
   * @param restart - Whether to restart the idle timer,`true` by default.
   */
  reset: (restart?: boolean) => void
}

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

export function useUserIdle(timeout: number = oneMinute, options: UseUserIdleOptions = {}): UseUserIdleReturns {
  const { immediate = true, initialState = false, watchVisibility = true, events = defaultEvents } = options

  const lastActiveRef = useRef(Date.now())
  const timer = useRef<SetTimeoutReturn | null>(null)
  const latestTimeout = useLatest(timeout)
  const [isIdle, setIsIdle] = useSafeState(initialState)

  const pausable = usePausable(
    false,
    (_ref, reset?: boolean) => reset && resetTimer(false),
    (_ref, reset?: boolean) => reset && resetTimer(true),
  )

  const resetTimer = useStableFn((restart = true, updateTimestamp = false) => {
    setIsIdle(false)

    if (updateTimestamp) lastActiveRef.current = timestamp()

    timer.current !== null && window.clearTimeout(timer.current)

    if (restart) {
      timer.current = window.setTimeout(() => setIsIdle(true), latestTimeout.current)
    }
  })

  const onEvent = useThrottledFn(() => resetTimer(true, true), { wait: 50 })

  useEventListener(() => window, events, onEvent, { passive: true })

  useEventListener(
    () => document,
    watchVisibility ? 'visibilitychange' : [],
    () => !document.hidden && onEvent(),
  )

  useMount(immediate && resetTimer)

  return {
    ...pausable,
    isIdle,
    lastActive: lastActiveRef,
    reset: resetTimer,
  }
}
