import { useRef } from 'react'
import { useEventListener } from '../use-event-listener'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { usePausable } from '../use-pausable'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { useTrackedRefState } from '../use-tracked-ref-state'
import { timestamp } from '../utils/basic'

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
  lastActive: number
  /**
   * Reset the idle state
   *
   * @param restart - Whether to restart the idle timer,`true` by default.
   */
  reset: (restart?: boolean, updateTimestamp?: boolean) => void
}

const defaultEvents: WindowEventName[] = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
const oneMinute = 60_000

/**
 * A React Hook that helps to detect whether the user is idle or not.
 */
export function useUserIdle(timeout: number = oneMinute, options: UseUserIdleOptions = {}): UseUserIdleReturns {
  const { immediate = true, initialState = false, watchVisibility = true, events = defaultEvents } = options

  const [state, { updateRefState }] = useTrackedRefState({
    isIdle: initialState,
    lastActive: Date.now(),
  })

  const timer = useRef<SetTimeoutReturn | null>(null)
  const latest = useLatest({ timeout })

  const pausable = usePausable(
    false,
    (_ref, reset?: boolean) => reset && resetTimer(false),
    (_ref, reset?: boolean) => reset && resetTimer(true),
  )

  const resetTimer = useStableFn((restart = true, updateTimestamp = false) => {
    updateRefState('isIdle', false)

    if (updateTimestamp) updateRefState('lastActive', timestamp())

    timer.current !== null && clearTimeout(timer.current)

    if (restart) {
      timer.current = setTimeout(() => updateRefState('isIdle', true), latest.current.timeout)
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
    get isIdle() {
      return state.isIdle
    },
    get lastActive() {
      return state.lastActive
    },
    reset: resetTimer,
  }
}
