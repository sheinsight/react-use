import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'
import { isFunction } from '../utils/basic'

import type { SetStateAction } from 'react'
import type { ReactSetState } from '../use-safe-state'
import type { AnyFunc } from '../utils/basic'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface UseAsyncFnOptions<D = any> {
  /**
   * Initial data to be used as the initial value
   *
   * @defaultValue undefined
   */
  initialValue?: D
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
  /**
   * a function to run before the async function
   *
   * @defaultValue undefined
   */
  onBefore?: () => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   */
  onSuccess?: (data: D) => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   */
  onFinally?: (data: D | undefined) => void
}

export interface UseAsyncFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>> {
  /**
   * a function to run the async function
   */
  run: T
  /**
   * a function to cancel the async function
   */
  cancel: () => void
  /**
   * manually set the value
   */
  mutate: ReactSetState<D | undefined>
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
  value: D | undefined
}

/**
 * A React Hook to run **async** functions with extra **loading** state that indicates whether the promise is pending.
 *
 * @param {AnyFunc} fn - `AnyFunc`, the async function to run, see {@link AnyFunc}
 * @returns {UseAsyncFnReturns} `UseAsyncFnReturns`, see {@link UseAsyncFnReturns}
 */
export function useAsyncFn<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fn: T,
  options: UseAsyncFnOptions<D> = {},
): UseAsyncFnReturns<T, D> {
  const { clearBeforeRun, onError, onBefore, onSuccess, onFinally } = options

  const render = useRender()
  const versionRef = useRef(0)

  const stateRef = useRef({
    error: { used: false, value: false },
    loading: { used: false, value: false },
    value: { used: false, value: options.initialValue },
  })

  function updateRefValue<T>(refItem: { used: boolean; value: T }, newValue: T, update = true) {
    if (refItem.value === newValue) return
    refItem.value = newValue
    refItem.used && update && render()
  }

  function runWhenVersionMatch(version: number, fu: AnyFunc) {
    version === versionRef.current && fu()
  }

  const cancel = useStableFn(() => {
    versionRef.current++
    updateRefValue(stateRef.current.loading, false)
  })

  const latest = useLatest({ fn, onError, onBefore, onSuccess, onFinally, clearBeforeRun })

  const stableRunFn = useStableFn(async (...args: Parameters<T>) => {
    const version = ++versionRef.current

    let result: D | undefined = undefined

    try {
      latest.current.onBefore?.()

      if (latest.current.clearBeforeRun) {
        updateRefValue(stateRef.current.value, undefined, false)
      }
      updateRefValue(stateRef.current.loading, true)
      result = await latest.current.fn(...args)
      latest.current.onSuccess?.(result as D)
      runWhenVersionMatch(version, () => {
        updateRefValue(stateRef.current.value, result)
      })
    } catch (error) {
      runWhenVersionMatch(version, () => {
        latest.current.onError?.(error)
        updateRefValue(stateRef.current.error, error, false)
      })
    } finally {
      runWhenVersionMatch(version, () => {
        latest.current.onFinally?.(result)
        updateRefValue(stateRef.current.loading, false, false)
      })
    }

    return result
  }) as T

  const mutate = useStableFn((action: SetStateAction<D | undefined>) => {
    const nextState = isFunction(action) ? action(stateRef.current.value.value) : action
    updateRefValue(stateRef.current.value, nextState)
  })

  return {
    run: stableRunFn,
    mutate,
    cancel,
    get loading() {
      stateRef.current.loading.used = true
      return stateRef.current.loading.value
    },
    get error() {
      stateRef.current.error.used = true
      return stateRef.current.error.value
    },
    get value() {
      stateRef.current.value.used = true
      return stateRef.current.value.value
    },
  }
}
