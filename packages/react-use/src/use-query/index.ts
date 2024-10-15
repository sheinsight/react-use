import { resolveMutateActions } from '../use-async-fn'
import { useDebouncedFn } from '../use-debounced-fn'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useLoadingSlowFn } from '../use-loading-slow-fn'
import { usePausable } from '../use-pausable'
import { useReConnect } from '../use-re-connect'
import { useReFocus } from '../use-re-focus'
import { useRetryFn } from '../use-retry-fn'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { useUpdateEffect } from '../use-update-effect'
import { isNumber } from '../utils/basic'
import { useQueryCache } from './use-query-cache'

import type { DependencyList } from 'react'
import type { UseAsyncFnMutateAction } from '../use-async-fn'
import type { UseDebouncedFnOptions } from '../use-debounced-fn'
import type { UseIntervalFnInterval } from '../use-interval-fn'
import type { UseLoadingSlowFnOptions, UseLoadingSlowFnReturns } from '../use-loading-slow-fn'
import type { Pausable } from '../use-pausable'
import type { UseReConnectOptions } from '../use-re-connect'
import type { UseReFocusOptions } from '../use-re-focus'
import type { UseRetryFnOptions } from '../use-retry-fn'
import type { UseThrottledFnOptions } from '../use-throttled-fn'
import type { AnyFunc, Gettable, Promisable } from '../utils/basic'
import type { UseQueryCacheLike } from './use-query-cache'

export const defaultIsVisible = () => !document.hidden
export const defaultIsOnline = () => navigator.onLine

export { mutate } from './use-query-cache'

export type { UseQueryMutate, UseQueryCacheLike } from './use-query-cache'

export interface UseQueryOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends Omit<UseLoadingSlowFnOptions<T, D, E>, 'initialValue'>,
    Pick<UseReConnectOptions, 'registerReConnect'>,
    Pick<UseReFocusOptions, 'registerReFocus'> {
  /**
   * Disable all automatic refresh behaviors, default is off
   *
   * @defaultValue false
   */
  manual?: boolean
  /**
   * Initial data passed to fetcher when first mount
   *
   * @defaultValue undefined
   */
  initialData?: D | undefined
  /**
   * Cache key, can be a string or a function that returns a string
   *
   * @defaultValue undefined
   */
  cacheKey?: string | ((...args: Parameters<T> | []) => string)
  /**
   * Max cache time, will clear the cache after the specified time
   *
   * default is 5_000 ms, set `false` to disable
   */
  cacheExpirationTime?: number | false
  /**
   * Cache provider, it can be set to an external store (reactive), localStorage, etc.
   *
   * Needs to comply with the UseQueryCacheLike interface definition, defaults to a globally shared `new Map()`
   *
   * @defaultValue global shared `new Map()`
   */
  provider?: Gettable<UseQueryCacheLike<D>>
  /**
   * ThrottleOptions => only affects the frequency of manually executing the run method
   *
   * @defaultValue undefined
   */
  throttle?: UseThrottledFnOptions['wait'] | UseThrottledFnOptions
  /**
   * DebounceOptions => only affects the frequency of manually executing the run method
   *
   * @defaultValue undefined
   */
  debounce?: UseDebouncedFnOptions['wait'] | UseDebouncedFnOptions
  /**
   * Whether to reload when focus is obtained, default is off
   *
   * @defaultValue false
   */
  refreshOnFocus?: boolean
  /**
   * Throttle time when obtaining focus, default 5_000 (ms), only valid when `refreshOnFocus` is true
   *
   * @defaultValue 5_000
   */
  refreshOnFocusThrottleWait?: number
  /**
   * Custom visibility judgment function
   *
   * @defaultValue defaultIsVisible
   */
  isVisible?: () => Promisable<boolean>
  /**
   * Whether to reload when network reconnects, default is off
   *
   * @defaultValue false
   */
  refreshOnReconnect?: boolean
  /**
   * Custom online judgment function
   *
   * @defaultValue defaultIsOnline
   */
  isOnline?: () => Promisable<boolean>
  /**
   * Interval time for automatic refresh, default is 0, off
   *
   * @defaultValue 0
   */
  refreshInterval?: Exclude<UseIntervalFnInterval, 'requestAnimationFrame'>
  /**
   * Whether to reload when hidden, default is off
   *
   * @defaultValue false
   */
  refreshWhenHidden?: boolean
  /**
   * Whether to reload when offline, default is off
   *
   * @defaultValue false
   */
  refreshWhenOffline?: boolean
  /**
   * The dependencies of the refresh operation, when the dependencies change, the refresh operation will be triggered
   *
   * @defaultValue []
   */
  refreshDependencies?: DependencyList
  /**
   * Error retry count
   *
   * @defaultValue 0
   */
  errorRetryCount?: UseRetryFnOptions<E>['count']
  /**
   * Error retry interval
   *
   * @defaultValue `defaultRetryInterval` in `useRetryFn`
   */
  errorRetryInterval?: UseRetryFnOptions<E>['interval']
  /**
   * Whether to clear the cache before each request
   *
   * @defaultValue undefined
   */
  onErrorRetry?: UseRetryFnOptions<E>['onErrorRetry']
  /**
   * Callback executed when the request is canceled
   *
   * @defaultValue undefined
   */
  onErrorRetryFailed?: UseRetryFnOptions<E>['onRetryFailed']
}

export interface UseQueryReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends Pausable,
    Omit<UseLoadingSlowFnReturns<T, D, E>, 'value'> {
  /**
   * The data returned by the request
   */
  data: D | undefined
  /**
   * Whether the request is in the initialization state (no data + loading, initializing => !data && loading)
   */
  initializing: boolean
  /**
   * Whether the request is refreshing data (has data + loading, refreshing => data && loading)
   */
  refreshing: boolean
}

/**
 * A basic React Hook for data fetching, supports cache, automatic refresh, and many awesome features.
 *
 * @since 1.5.0
 */
export function useQuery<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fetcher: T,
  options: UseQueryOptions<T, D, E> = {},
): UseQueryReturns<T, D, E> {
  const [cache, cacheActions] = useQueryCache<T, D>(options)

  const debounceOptions = isNumber(options.debounce) ? { wait: options.debounce } : options.debounce
  const throttleOptions = isNumber(options.throttle) ? { wait: options.throttle } : options.throttle

  const enableRateControl = Boolean(debounceOptions || throttleOptions)

  const latest = useLatest({ fetcher, cache, enableRateControl, ...options })

  const service = useLoadingSlowFn<T, D, E>(
    useRetryFn<T, E>(
      ((...args) => {
        const prePromise = cacheActions.getPromiseCache()
        if (prePromise) return prePromise
        const promise = latest.current.fetcher(...args)
        cacheActions.setPromiseCache(promise)
        return promise
      }) as T,
      {
        count: options.errorRetryCount ?? 0,
        interval: options.errorRetryInterval,
        onErrorRetry: options.onErrorRetry,
        onRetryFailed(...args) {
          latest.current.onErrorRetryFailed?.(...args)
          throw args[0]
        },
        onError(...args) {
          cacheActions.clearPromiseCache()
        },
      },
    ),
    {
      immediate: options.immediate ?? !options.manual,
      initialParams: options.initialParams,
      initialValue: options.initialData ?? cache.data,
      clearBeforeRun: options.clearBeforeRun,
      loadingTimeout: options.loadingTimeout,
      onBefore(...args) {
        if (latest.current.clearBeforeRun) cacheActions.setCache(undefined, [])
        intervalPausable.resume()
        return latest.current.onBefore?.(...args)
      },
      onLoadingSlow: options.onLoadingSlow,
      onCancel(...args) {
        cacheActions.clearPromiseCache()
        return latest.current.onCancel?.(...args)
      },
      onSuccess(nextData, params, ...rest) {
        cacheActions.setCache(nextData, params)
        return latest.current.onSuccess?.(nextData, params, ...rest)
      },
      onError: options.onError,
      onFinally(...args) {
        cacheActions.clearPromiseCache()
        return latest.current.onFinally?.(...args)
      },
      onMutate(nextData, params, ...rest) {
        cacheActions.setCache(nextData, params)
        return latest.current.onMutate?.(nextData, params, ...rest)
      },
      onRefresh: options.onRefresh,
    },
  )

  const refreshWithStatusCheck = useStableFn(async () => {
    if (!pausable.isActive() || latest.current.manual) return

    const {
      refreshWhenHidden = false,
      refreshWhenOffline = false,
      isVisible = defaultIsVisible,
      isOnline = defaultIsOnline,
    } = latest.current

    const isVisibleMatch = (await isVisible()) || refreshWhenHidden
    const isOnlineMatch = (await isOnline()) || refreshWhenOffline

    const params = cacheActions.isCacheEnabled ? latest.current.cache.params : service.params

    if (isVisibleMatch && isOnlineMatch) return service.refresh(params)
  })

  const serviceWithRateControl = useThrottledFn(useDebouncedFn(service.run, debounceOptions), throttleOptions)
  const refreshWithRateControl = useThrottledFn(useDebouncedFn(service.refresh, debounceOptions), throttleOptions)

  const intervalPausable = useIntervalFn(refreshWithStatusCheck, options.refreshInterval ?? 0, {
    immediate: Boolean(options.refreshInterval && !options.manual),
  })

  useReConnect(() => options.refreshOnReconnect && refreshWithStatusCheck(), {
    registerReConnect: options.registerReConnect,
  })

  useReFocus(() => options.refreshOnFocus && refreshWithStatusCheck(), {
    registerReFocus: options.registerReFocus,
    wait: options.refreshOnFocusThrottleWait ?? 5_000,
  })

  const pausable = usePausable(
    true,
    () => {
      intervalPausable.pause()
      service.cancel()
    },
    () => intervalPausable.resume(),
  )

  useUpdateEffect(() => void refreshWithStatusCheck(), [...(options.refreshDependencies ?? [])])

  const mutateWithCache = useStableFn((...actions: UseAsyncFnMutateAction<D | undefined, Parameters<T> | []>) => {
    const data = cacheActions.isCacheEnabled ? latest.current.cache.data : service.value
    const params = cacheActions.isCacheEnabled ? latest.current.cache.params : service.params
    const [nextData, nextParams] = resolveMutateActions<D | undefined, Parameters<T> | []>(actions, data, params)
    return service.mutate(nextData, nextParams)
  })

  const refreshWithCache = useStableFn(async (params?: Parameters<T> | []) => {
    const outerParams = cacheActions.isCacheEnabled ? latest.current.cache.params : service.params
    const actualParams = params ?? (outerParams || [])
    return latest.current.enableRateControl ? refreshWithRateControl(actualParams) : service.refresh(actualParams)
  })

  return {
    ...pausable,
    mutate: mutateWithCache,
    refresh: refreshWithCache,
    run: (enableRateControl ? serviceWithRateControl : service.run) as T,
    cancel: service.cancel,
    get params() {
      return cacheActions.isCacheEnabled ? cache.params : service.params
    },
    get loadingSlow() {
      return service.loadingSlow
    },
    get data() {
      return cacheActions.isCacheEnabled ? cache.data : service.value
    },
    get error() {
      return service.error
    },
    get loading() {
      return service.loading
    },
    get refreshing() {
      const data = cacheActions.isCacheEnabled ? cache.data : service.value
      return Boolean(data && service.loading)
    },
    get initializing() {
      const data = cacheActions.isCacheEnabled ? cache.data : service.value
      return Boolean(!data && service.loading)
    },
  }
}
