import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'

import type { AnyFunc } from '../utils/basic'

export interface UseReConnectOptions {
  /**
   * Register reconnect event listener.
   */
  registerReConnect?: (callback: AnyFunc) => void
}

export function registerWebReConnect(callback: AnyFunc) {
  const connectedState = { current: navigator.onLine }

  function handleOnline() {
    const nextState = true

    if (!connectedState.current) {
      callback()
      connectedState.current = nextState
    }
  }

  function handleOffline() {
    const nextState = false
    connectedState.current = nextState
  }

  window.addEventListener('online', handleOnline, { passive: true })
  window.addEventListener('offline', handleOffline, { passive: true })

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}

export function useReConnect(callback: AnyFunc, options: UseReConnectOptions = {}) {
  const { registerReConnect = registerWebReConnect } = options

  const latest = useLatest({ callback })

  useEffectOnce(() => {
    return registerReConnect(() => latest.current.callback())
  })
}
