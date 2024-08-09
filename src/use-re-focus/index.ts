import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { useThrottledFn } from '../use-throttled-fn'

import type { UseThrottledFnOptions } from '../use-throttled-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseReFocusOptions extends UseThrottledFnOptions {
  /**
   * Register focus event listener.
   */
  registerReFocus?: (callback: AnyFunc) => void
}

export function registerWebReFocus(callback: AnyFunc) {
  function handleFocus() {
    callback()
  }

  function handleVisibilityChange() {
    if (!document.hidden) {
      handleFocus()
    }
  }

  window.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })
  window.addEventListener('focus', handleFocus, { passive: true })

  return () => {
    window.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleFocus)
  }
}

/**
 * A hook to call the callback when the window is focused.
 *
 * @since 1.4.0
 */
export function useReFocus(callback: AnyFunc, options: UseReFocusOptions = {}) {
  const { registerReFocus = registerWebReFocus, ...throttleOptions } = options

  const throttledFn = useThrottledFn(callback, {
    leading: true,
    trailing: false,
    ...throttleOptions,
  })

  const latest = useLatest({ throttledFn })

  useEffectOnce(() => {
    return registerReFocus(() => latest.current.throttledFn())
  })

  return throttledFn.clear
}

export function createReactNativeReFocusRegister(appState: any) {
  return function registerReactNativeReFocus(callback: AnyFunc) {
    let state = appState.currentState

    const onAppStateChange = (nextAppState: string) => {
      if (state.match(/inactive|background/) && nextAppState === 'active') {
        callback()
      }

      state = nextAppState
    }

    const subscription = appState.addEventListener('change', onAppStateChange)

    return () => subscription.remove()
  }
}
