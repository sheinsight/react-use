import { useLatest } from '../use-latest'
import { useMount } from '../use-mount'
import { useStableFn } from '../use-stable-fn'
import { useTrackedRefState } from '../use-tracked-ref-state'
import { useUnmount } from '../use-unmount'
import { useVersionedAction } from '../use-versioned-action'
import { isFunction } from '../utils/basic'

import type { AnyFunc, Gettable, Promisable } from '../utils/basic'

export interface UseAsyncFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any> {
  /**
   * Initial data to be used as the initial value
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  initialValue?: D
  /**
   * Initial parameters passed to fetcher when first mount
   *
   * @defaultValue []
   *
   * @since 1.4.0
   */
  initialParams?: Gettable<Promisable<Parameters<T> | []>>
  /**
   * whether to run the async function immediately on component mount
   *
   * @defaultValue false
   *
   * @since 1.4.0
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
   *
   * @since 1.4.0
   */
  cancelOnUnmount?: boolean
  /**
   * a function to run when the async function throws an error
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onError?: (error: E | undefined) => void
  /**
   * a function to run before the async function
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onBefore?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onSuccess?: (value: D, params: Parameters<T> | []) => void
  /**
   * a function to run after the async function
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onFinally?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the async function is cancelled
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onCancel?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the value is mutated
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onMutate?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * a function to run when the value is refreshed
   *
   * @defaultValue undefined
   *
   * @since 1.4.0
   */
  onRefresh?: (value: D | undefined, params: Parameters<T> | []) => void
  /**
   * Custom cache comparison function, true means the cache is the same
   *
   * @defaultValue shallowEqual
   *
   * @since 1.4.0
   */
  compare?: (prevData: D | undefined, nextData: D | undefined) => boolean
}

export type UseAsyncFnMutateAction<D, P> =
  | [D | undefined]
  | [D | undefined, P | undefined]
  | [(prevData: D | undefined, preParams?: P) => [D, P | undefined]]

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

export function resolveMutateActions<D, P>(actions: UseAsyncFnMutateAction<D, P>, prevData: D, prevParams: P): [D, P] {
  return (isFunction(actions[0]) ? actions[0](prevData, prevParams) : (actions as [D, P])) as [D, P]
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

  const [incVersion, runVersionedAction] = useVersionedAction()

  const [refState, actions, stateRef] = useTrackedRefState({
    error: undefined as E | undefined,
    loading: Boolean(immediate),
    value: options.initialValue,
    params: [] as Parameters<T> | [],
  })

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
    incVersion()
    actions.updateRefState('loading', false)
    latest.current.onCancel?.(stateRef.value.value, stateRef.params.value)
  })

  const run = useStableFn(async (...args: Parameters<T> | []) => {
    actions.updateRefState('params', args)

    const version = incVersion()

    let result: D | undefined = undefined

    try {
      latest.current.onBefore?.(stateRef.value.value, stateRef.params.value)

      if (latest.current.clearBeforeRun) {
        actions.updateRefState('value', undefined)
      }

      actions.updateRefState('loading', true)

      result = await latest.current.fn(...args)

      runVersionedAction(version, () => {
        latest.current.onSuccess?.(result as D, stateRef.params.value)
        actions.updateRefState('value', result, latest.current.compare)
        actions.updateRefState('error', undefined)
      })
    } catch (error) {
      runVersionedAction(version, () => {
        latest.current.onError?.(error as E | undefined)
        actions.updateRefState('error', error as E | undefined)
      })
    } finally {
      runVersionedAction(version, () => {
        latest.current.onFinally?.(result, stateRef.params.value)
        actions.updateRefState('loading', false)
      })
    }

    return result
  }) as T

  const mutate = useStableFn((...mutateActions: UseAsyncFnMutateAction<D | undefined, Parameters<T> | []>) => {
    const [nextValue, nextParams] = resolveMutateActions<D | undefined, Parameters<T> | []>(
      mutateActions,
      stateRef.value.value,
      stateRef.params.value,
    )

    actions.updateRefState('value', nextValue)
    actions.updateRefState('params', nextParams)

    latest.current.onMutate?.(nextValue, nextParams ?? [])
  })

  const refresh = useStableFn(async (params?: Parameters<T> | []) => {
    const actualParams = (params ?? stateRef.params.value) || []
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
    get loading() {
      return refState.loading
    },
    get error() {
      return refState.error
    },
    get value() {
      return refState.value
    },
    get params() {
      return refState.params
    },
  }
}
