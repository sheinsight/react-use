import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useTimeoutFn } from '../use-timeout-fn'

import type { Pausable } from '../use-pausable'
import type { UseTimeoutFnOptions } from '../use-timeout-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseTimeoutOptions<Controls extends boolean, Callback extends AnyFunc = AnyFunc>
  extends UseTimeoutFnOptions {
  /**
   * Expose more controls
   *
   * @defaultValue false
   */
  controls?: Controls
  /**
   * Callback on timeout
   */
  callback?: Callback
}

export type UseTimeoutReturns<Controls extends boolean, C extends AnyFunc = AnyFunc> = Controls extends true
  ? Pausable<[], Parameters<C> | []> & {
      /**
       * Timeout state
       */
      isTimeout: boolean
      /**
       * Reset the timeout
       */
      reset(): void
    }
  : boolean

/**
 * A React Hook that create a state that changes after a specified delay.
 */
export function useTimeout(interval?: number, options?: UseTimeoutOptions<false>): UseTimeoutReturns<false>
export function useTimeout<C extends AnyFunc>(
  interval: number,
  options: UseTimeoutOptions<true, C>,
): UseTimeoutReturns<true, C>
export function useTimeout<C extends AnyFunc>(interval = 1000, options: UseTimeoutOptions<boolean, C> = {}) {
  const { controls: exposeControls = false, immediate, callback } = options
  const [isTimeout, setIsTimeout] = useSafeState(false)
  const latest = useLatest({ callback })

  const controls = useTimeoutFn<C>(
    ((...args) => {
      setIsTimeout(true)
      latest.current.callback?.(...args)
    }) as C,
    interval,
    { immediate: !exposeControls, ...options },
  )

  const reset = useStableFn(() => setIsTimeout(false))

  return exposeControls ? { isTimeout, reset, ...controls } : isTimeout
}
