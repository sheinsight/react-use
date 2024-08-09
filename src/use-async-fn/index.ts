import { useRef } from 'react'
import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'
import { useUnmount } from '../use-unmount'
import { isFunction } from '../utils/basic'
import { shallowEqual } from '../utils/equal'

import type { AnyFunc, Gettable, Promisable } from '../utils/basic'

export interface UseAsyncFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any> {
  /**
   * Initial data to be used as the initial value
   *
   * @defaultValue undefined
   */
  initialValue?: D
  /**
   * Initial parameters passed to fetcher when first mount
   *
   * @defaultValue []
   */
  initialParams?: Gettable<Promisable<Parameters<T> | []>>
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
  onError?: (error: E | undefined) => void
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
   *
   * @defaultValue undefined
   */
  onMutate?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the value is refreshed
   *
   * @defaultValue undefined
   */
  onRefresh?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * Custom cache comparison function, true means the cache is the same
   *
   * @defaultValue shallowEqual
   */
  compare?: (prevData: D | undefined, nextData: D | undefined) => boolean
}

export type UseAsyncFnMutateAction<D, P> =
  | [D | undefined]
  | [D | undefined, P | undefined]
  | [(prevData: D | undefined, preParams?: P) => [D, P | undefined]]

export function resolveMutateActions<D, P>(actions: UseAsyncFnMutateAction<D, P>, prevData: D, prevParams: P): [D, P] {
  return (isFunction(actions[0]) ? actions[0](prevData, prevParams) : (actions as [D, P])) as [D, P]
}

export interface UseAsyncFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any> {
  /**
   * a function to run the async function
   */
  run: T
  /**
   * a function to refresh the async function
   */
  refresh: (params?: Parameters<T> | []) => Promise<D | undefined>
  /**
   * a function to cancel the async function
   */
  cancel: () => void
  /**
   * manually set the value
   */
  mutate: (...actions: UseAsyncFnMutateAction<D | undefined, Parameters<T> | []>) => void
  /**
   * whether the async function is loading
   */
  loading: boolean
  /**
   * the error thrown by the async function
   */
  error: E | undefined
  /**
   * the value returned by the async function
   */
  value: D | undefined
  /**
   * the parameters passed to the async function
   */
  params: Parameters<T> | []
}

interface RefItem<T> {
  used: boolean
  value: T
}

/**
 * A React Hook to run **async** functions with extra **loading** state that indicates whether the promise is pending.
 *
 * @param {AnyFunc} fn - `AnyFunc`, the async function to run, see {@link AnyFunc}
 * @returns {UseAsyncFnReturns} `UseAsyncFnReturns`, see {@link UseAsyncFnReturns}
 */
export function useAsyncFn<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fn: T,
  options: UseAsyncFnOptions<T, D, E> = {},
): UseAsyncFnReturns<T, D, E> {
  const {
    initialParams = [],
    immediate = false,
    clearBeforeRun = false,
    cancelOnUnmount = true,
    compare,
    onError,
    onMutate,
    onRefresh,
    onCancel,
    onBefore,
    onSuccess,
    onFinally,
  } = options

  const render = useRender()

  const stateRef = useRef({
    version: 0,
    error: { used: false, value: undefined as E | undefined },
    loading: { used: false, value: Boolean(immediate) },
    value: { used: false, value: options.initialValue },
    params: { used: false, value: [] as Parameters<T> | [] },
  })

  function updateRefValue<T>(
    refItem: RefItem<T>,
    newValue: T,
    compare: (prevData: T, nextData: T) => boolean = shallowEqual,
  ) {
    if (shallowEqual(refItem.value, newValue)) return
    const valueChanged = !compare(refItem.value, newValue)

    if (valueChanged) {
      refItem.value = newValue
      refItem.used && valueChanged && render()
    }
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
    onRefresh,
    onError,
    onBefore,
    onSuccess,
    onFinally,
    compare,
  })

  const cancel = useStableFn(() => {
    stateRef.current.version++
    updateRefValue(stateRef.current.loading, false)
    latest.current.onCancel?.(stateRef.current.value.value, stateRef.current.params.value)
  })

  const run = useStableFn(async (...args: Parameters<T> | []) => {
    updateRefValue(stateRef.current.params, args)

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
        updateRefValue(stateRef.current.value, result, latest.current.compare)
        updateRefValue(stateRef.current.error, undefined)
      })
    } catch (error) {
      runWhenVersionMatch(version, () => {
        latest.current.onError?.(error as E | undefined)
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

  const mutate = useStableFn((...actions: UseAsyncFnMutateAction<D | undefined, Parameters<T> | []>) => {
    const [nextValue, nextParams] = resolveMutateActions<D | undefined, Parameters<T> | []>(
      actions,
      stateRef.current.value.value,
      stateRef.current.params.value,
    )

    updateRefValue(stateRef.current.value, nextValue)
    updateRefValue(stateRef.current.params, nextParams)

    latest.current.onMutate?.(nextValue, nextParams ?? [])
  })

  const refresh = useStableFn(async (params?: Parameters<T> | []) => {
    const actualParams = (params ?? stateRef.current.params.value) || []
    const result = await run(...actualParams)
    latest.current.onRefresh?.(result, actualParams)
    return result
  })

  useMount(async () => {
    if (immediate) {
      const params = await (initialParams instanceof Function ? initialParams() : initialParams)
      await run(...params)
    }
  })

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
