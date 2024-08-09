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
  function handleOnline() {
    callback()
  }

  window.addEventListener('online', handleOnline, { passive: true })

  return () => {
    window.removeEventListener('online', handleOnline)
  }
}

/**
 * A hook to call the callback when the network is reconnected.
 *
 * @since 1.4.0
 */
export function useReConnect(callback: AnyFunc, options: UseReConnectOptions = {}) {
  const { registerReConnect = registerWebReConnect } = options

  const latest = useLatest({ callback })

  useEffectOnce(() => {
    return registerReConnect(() => latest.current.callback())
  })
}
