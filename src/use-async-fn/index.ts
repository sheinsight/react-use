import { useRef } from 'react'
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
  /**
   * a function to run when the async function throws an error
   *
   * @defaultValue undefined
   */
  onError?: (error: unknown) => void
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
  const { clearBeforeRun, onError } = options

  const versionRef = useRef(0)

  const [state, setState] = useSetState({
    loading: false,
    error: null as unknown | null,
    value: undefined as Awaited<ReturnType<T>> | undefined,
  })

  const latest = useLatest({ fn, onError, clear: clearBeforeRun })

  const stableRunFn = useStableFn(async (...args: Parameters<T>) => {
    const ver = ++versionRef.current
    const newState = latest.current.clear ? { loading: true, value: undefined } : { loading: true }

    setState(newState)

    let error: unknown | null = null
    let result: Awaited<ReturnType<T>> | undefined = undefined

    try {
      result = await latest.current.fn(...args)
    } catch (err) {
      if (ver === versionRef.current) {
        error = err
        latest.current.onError?.(err)
      }
    } finally {
      if (ver === versionRef.current) {
        setState({ value: result, error, loading: false })
      }
    }

    return result
  }) as T

  return {
    run: stableRunFn,
    ...state,
  }
}
