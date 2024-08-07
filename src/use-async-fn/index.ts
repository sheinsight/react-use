import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { isFunction } from '../utils/basic'
import { shallowEqual } from '../utils/equal'

import type { SetStateAction } from 'react'
import type { ReactSetState } from '../use-safe-state'
import type { AnyFunc } from '../utils/basic'

export interface UseAsyncFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>> {
  /**
   * Initial data to be used as the initial value
   *
   * @defaultValue undefined
   */
  initialValue?: D
  /**
   * whether to run the async function immediately on component mount
   *
   * @defaultValue false
   */
  immediate?: boolean
  /**
   * whether to clear the value before running the function
   *
   * @defaultValue false
   */
  clearBeforeRun?: boolean
  /**
   * whether to cancel the async function when the component is unmounted
   *
   * @defaultValue true
   */
  cancelOnUnmount?: boolean
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
  onBefore?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   */
  onSuccess?: (value: D, params: Parameters<T> | []) => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   */
  onFinally?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the async function is cancelled
   *
   * @defaultValue undefined
   */
  onCancel?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the value is mutated
   */
  onMutate?: (value: D | undefined, params: Parameters<T> | []) => void
}

export interface UseAsyncFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>> {
  /**
   * a function to run the async function
   */
  run: T
  /**
   * a function to refresh the async function
   */
  refresh: () => Promise<D | undefined>
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
  /**
   * the parameters passed to the async function
   */
  params: Parameters<T> | []
}

/**
 * A React Hook to run **async** functions with extra **loading** state that indicates whether the promise is pending.
 *
 * @param {AnyFunc} fn - `AnyFunc`, the async function to run, see {@link AnyFunc}
 * @returns {UseAsyncFnReturns} `UseAsyncFnReturns`, see {@link UseAsyncFnReturns}
 */
export function useAsyncFn<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fn: T,
  options: UseAsyncFnOptions<T, D> = {},
): UseAsyncFnReturns<T, D> {
  const {
    immediate = false,
    clearBeforeRun = false,
    cancelOnUnmount = true,
    onError,
    onMutate,
    onCancel,
    onBefore,
    onSuccess,
    onFinally,
  } = options

  const render = useRender()

  const stateRef = useRef({
    version: 0,
    error: { used: false, value: false },
    loading: { used: false, value: Boolean(immediate) },
    value: { used: false, value: options.initialValue },
    params: { used: false, value: [] as Parameters<T> | [] },
  })

  function updateRefValue<T>(refItem: { used: boolean; value: T }, newValue: T, update = true) {
    if (shallowEqual(refItem.value, newValue)) return
    refItem.value = newValue
    refItem.used && update && render()
  }

  function runWhenVersionMatch(version: number, fu: AnyFunc) {
    version === stateRef.current.version && fu()
  }

  const latest = useLatest({
    fn,
    clearBeforeRun,
    cancelOnUnmount,
    onMutate,
    onCancel,
    onError,
    onBefore,
    onSuccess,
    onFinally,
  })

  const cancel = useStableFn(() => {
    stateRef.current.version++
    updateRefValue(stateRef.current.loading, false)
    latest.current.onCancel?.(stateRef.current.value.value, stateRef.current.params.value)
  })

  const run = useStableFn(async (...args: Parameters<T>) => {
    updateRefValue(stateRef.current.params, args, false)

    const version = ++stateRef.current.version

    let result: D | undefined = undefined

    try {
      latest.current.onBefore?.(stateRef.current.value.value, stateRef.current.params.value)

      if (latest.current.clearBeforeRun) {
        updateRefValue(stateRef.current.value, undefined)
      }

      updateRefValue(stateRef.current.loading, true)

      result = await latest.current.fn(...args)

      runWhenVersionMatch(version, () => {
        latest.current.onSuccess?.(result as D, stateRef.current.params.value)
        updateRefValue(stateRef.current.value, result)
        updateRefValue(stateRef.current.error, undefined)
      })
    } catch (error) {
      runWhenVersionMatch(version, () => {
        latest.current.onError?.(error)
        updateRefValue(stateRef.current.error, error)
      })
    } finally {
      runWhenVersionMatch(version, () => {
        latest.current.onFinally?.(result, stateRef.current.params.value)
        updateRefValue(stateRef.current.loading, false)
      })
    }

    return result
  }) as T

  const mutate = useStableFn((action: SetStateAction<D | undefined>) => {
    const nextState = isFunction(action) ? action(stateRef.current.value.value) : action
    updateRefValue(stateRef.current.value, nextState)
    latest.current.onMutate?.(nextState, stateRef.current.params.value)
  })

  const refresh = useStableFn(() => {
    return run(...stateRef.current.params.value)
  })

  useMount(immediate && run)

  useUnmount(cancelOnUnmount && cancel)

  return {
    run,
    refresh,
    mutate,
    cancel,
    get params() {
      stateRef.current.params.used = true
      return stateRef.current.params.value
    },
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
