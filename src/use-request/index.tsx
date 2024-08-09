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
import { useRequestCache } from './use-request-cache'

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
import type { CacheLike } from './use-request-cache'

export const defaultIsVisible = () => !document.hidden
export const defaultIsOnline = () => navigator.onLine

export { mutate } from './use-request-cache'

export type { UseRequestMutate, CacheLike } from './use-request-cache'

export interface UseRequestOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>>
  extends Omit<UseLoadingSlowFnOptions<T, D>, 'initialValue'>,
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
   * Needs to comply with the CacheLike interface definition, defaults to a globally shared `new Map()`
   *
   * @defaultValue global shared `new Map()`
   */
  provider?: Gettable<CacheLike<D>>
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
   * Throttle time when obtaining focus, default 0, off
   *
   * @defaultValue 0
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
  errorRetryCount?: UseRetryFnOptions['count']
  /**
   * Error retry interval
   *
   * @defaultValue 0
   */
  errorRetryInterval?: UseRetryFnOptions['interval']
  /**
   * Whether to clear the cache before each request
   *
   * @defaultValue false
   */
  onErrorRetry?: UseRetryFnOptions['onErrorRetry']
}

export interface UseRequestReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>>
  extends Pausable,
    Omit<UseLoadingSlowFnReturns<T, D>, 'value'> {
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

export function useRequest<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fetcher: T,
  options: UseRequestOptions<T, D> = {},
): UseRequestReturns<T, D> {
  const [cache, cacheActions] = useRequestCache<T, D>(options)

  const latest = useLatest({ fetcher, cache, ...options })
  const debounceOptions = isNumber(options.debounce) ? { wait: options.debounce } : options.debounce
  const throttleOptions = isNumber(options.throttle) ? { wait: options.throttle } : options.throttle

  const service = useLoadingSlowFn(
    useRetryFn(
      (async (...args) => {
        const prePromise = cacheActions.getPromiseCache()
        if (prePromise) return prePromise
        const promise = latest.current.fetcher(...args)
        cacheActions.setPromiseCache(promise)
        return await promise
      }) as T,
      {
        count: options.errorRetryCount,
        interval: options.errorRetryInterval,
        onErrorRetry: options.onErrorRetry,
        onError(...args) {
          cacheActions.clearPromiseCache()
          return latest.current.onError?.(...args)
        },
      },
    ),
    {
      immediate: options.immediate ?? true,
      initialParams: options.initialParams,
      initialValue: options.initialData ?? cache.data,
      clearBeforeRun: options.clearBeforeRun,
      loadingTimeout: options.loadingTimeout,
      onLoadingSlow: options.onLoadingSlow,
      onRefresh: options.onRefresh,
      onCancel(...args) {
        cacheActions.clearPromiseCache()
        return latest.current.onCancel?.(...args)
      },
      onFinally(...args) {
        cacheActions.clearPromiseCache()
        return latest.current.onFinally?.(...args)
      },
      onSuccess(nextData, params, ...rest) {
        cacheActions.setCache(nextData, params)
        return latest.current.onSuccess?.(nextData, params, ...rest)
      },
      onBefore(...args) {
        if (latest.current.clearBeforeRun) cacheActions.setCache(undefined)
        intervalPausable.resume()
        return latest.current.onBefore?.(...args)
      },
      onMutate(nextData, params, ...rest) {
        cacheActions.setCache(nextData, params)
        return latest.current.onMutate?.(nextData, params, ...rest)
      },
    },
  )

  const serviceWithStatusCheck = useStableFn(async () => {
    if (!pausable.isActive() || latest.current.manual) return

    const {
      refreshWhenHidden = false,
      refreshWhenOffline = false,
      isVisible = defaultIsVisible,
      isOnline = defaultIsOnline,
    } = latest.current

    const isVisibleMatch = (await isVisible()) || refreshWhenHidden
    const isOnlineMatch = (await isOnline()) || refreshWhenOffline

    if (isVisibleMatch && isOnlineMatch) return service.run()
  })

  const serviceWithRateControl = useThrottledFn(useDebouncedFn(service.run, debounceOptions), throttleOptions)

  const intervalPausable = useIntervalFn(serviceWithStatusCheck, options.refreshInterval ?? 0, {
    immediate: Boolean(options.refreshInterval && !options.manual),
  })

  useReConnect(() => options.refreshOnReconnect && serviceWithStatusCheck(), {
    registerReConnect: options.registerReConnect,
  })

  useReFocus(() => options.refreshOnFocus && serviceWithStatusCheck(), {
    registerReFocus: options.registerReFocus,
    wait: options.refreshOnFocusThrottleWait ?? 5000,
  })

  const pausable = usePausable(
    true,
    () => {
      intervalPausable.pause()
      service.cancel()
    },
    () => intervalPausable.resume(),
  )

  useUpdateEffect(() => void serviceWithStatusCheck(), [...(options.refreshDependencies ?? [])])

  const mutateWithCache = useStableFn((...actions: UseAsyncFnMutateAction<D | undefined, Parameters<T> | []>) => {
    const data = cacheActions.isCacheEnabled() ? latest.current.cache.data : service.value
    const params = cacheActions.isCacheEnabled() ? latest.current.cache.params : service.params
    const [nextData, nextParams] = resolveMutateActions<D | undefined, Parameters<T> | []>(actions, data, params)
    return service.mutate(nextData, nextParams)
  })

  const refreshWithCache = useStableFn(async (params?: Parameters<T> | []) => {
    const actualParams = (params ?? service.params) || []
    return service.refresh(actualParams)
  })

  return {
    ...pausable,
    mutate: mutateWithCache,
    refresh: refreshWithCache,
    run: serviceWithRateControl,
    cancel: service.cancel,
    get params() {
      return cacheActions.isCacheEnabled() ? cache.params : service.params
    },
    get loadingSlow() {
      return service.loadingSlow
    },
    get data() {
      return cacheActions.isCacheEnabled() ? cache.data : service.value
    },
    get error() {
      return service.error
    },
    get loading() {
      return service.loading
    },
    get refreshing() {
      const data = cacheActions.isCacheEnabled() ? cache.data : service.value
      return Boolean(data && service.loading)
    },
    get initializing() {
      const data = cacheActions.isCacheEnabled() ? cache.data : service.value
      return Boolean(!data && service.loading)
    },
  }
}
