import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { useThrottledFn } from '../use-throttled-fn'

import type { UseThrottledFnOptions } from '../use-throttled-fn'
import type { AnyFunc } from '../utils/basic'

interface UseReFocusOptions extends UseThrottledFnOptions {
  /**
   * Register focus event listener.
   */
  registerReFocus?: (callback: AnyFunc) => void
}

export function registerWebReFocus(callback: AnyFunc) {
  const focusState = { current: false }

  function handleFocus() {
    const nextState = true

    if (!focusState.current) {
      callback()
      focusState.current = nextState
    }
  }

  function handleBlur() {
    const nextState = false
    focusState.current = nextState
  }

  window.addEventListener('focus', handleFocus, { passive: true })
  window.addEventListener('blur', handleBlur, { passive: true })

  return () => {
    window.removeEventListener('focus', handleFocus)
    window.removeEventListener('blur', handleBlur)
  }
}

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
}

// biome-ignore lint/suspicious/noExplicitAny: ignore appState type
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
