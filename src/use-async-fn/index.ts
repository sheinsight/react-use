import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'

import type { AnyFunc } from '../utils/basic'

export interface UseAsyncFnOptions {
  /**
   * whether to clear the value before running the function
   *
   * @defaultValue false
   */
  clearBeforeRun?: boolean
}

export interface UseAsyncFnReturns<T extends AnyFunc> {
  /**
   * a function to run the async function
   */
  run: T
  /**
   * whether the async function is loading
   */
  loading: boolean
  /**
   * the error thrown by the async function
   */
  error: unknown | null
  /**
   * the value returned by the async function
   */
  value: Awaited<ReturnType<T>> | undefined
}

/**
 * A React Hook to run **async** functions with extra **loading** state that indicates whether the promise is pending.
 *
 * @param {AnyFunc} fn - `AnyFunc`, the async function to run, see {@link AnyFunc}
 * @returns {UseAsyncFnReturns} `UseAsyncFnReturns`, see {@link UseAsyncFnReturns}
 */
export function useAsyncFn<T extends AnyFunc>(fn: T, options: UseAsyncFnOptions = {}): UseAsyncFnReturns<T> {
  const { clearBeforeRun } = options

  const [state, setState] = useSetState({
    loading: false,
    error: null as unknown | null,
    value: undefined as Awaited<ReturnType<T>> | undefined,
  })

  const latest = useLatest({ fn, clear: clearBeforeRun })

  const stableRunFn = useStableFn(async (...args: Parameters<T>) => {
    const newState = latest.current.clear ? { loading: true, value: undefined } : { loading: true }

    setState(newState)

    let error: unknown | null = null
    let result: Awaited<ReturnType<T>> | undefined = undefined

    try {
      result = await latest.current.fn(...args)
      return result
    } catch (err) {
      error = err
      throw err
    } finally {
      setState({ value: result, error, loading: false })
    }
  }) as T

  return {
    run: stableRunFn,
    ...state,
  }
}
