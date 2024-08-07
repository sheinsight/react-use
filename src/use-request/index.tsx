import { useRef } from 'react'
import { useDebouncedFn } from '../use-debounced-fn'
import { useIntervalFn } from '../use-interval-fn'
import { useLatest } from '../use-latest'
import { useLoadingSlowFn } from '../use-loading-slow-fn'
import { useMount } from '../use-mount'
import { usePausable } from '../use-pausable'
import { useReConnect } from '../use-re-connect'
import { useReFocus } from '../use-re-focus'
import { useRetryFn } from '../use-retry-fn'
import { useStableFn } from '../use-stable-fn'
import { useThrottledFn } from '../use-throttled-fn'
import { useUnmount } from '../use-unmount'
import { useUpdateEffect } from '../use-update-effect'
import { isDefined, isFunction, isNumber } from '../utils/basic'
import { unwrapArrayable, unwrapGettable } from '../utils/unwrap'

import type { DependencyList, SetStateAction } from 'react'
import type { UseDebouncedFnOptions } from '../use-debounced-fn'
import type { UseIntervalFnInterval } from '../use-interval-fn'
import type { UseLoadingSlowFnOptions, UseLoadingSlowFnReturns } from '../use-loading-slow-fn'
import type { Pausable } from '../use-pausable'
import type { UseReConnectOptions } from '../use-re-connect'
import type { UseReFocusOptions } from '../use-re-focus'
import type { UseRetryFnOptions } from '../use-retry-fn'
import type { UseThrottledFnOptions } from '../use-throttled-fn'
import type { AnyFunc, Arrayable, Gettable, Promisable } from '../utils/basic'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const globalCache: CacheLike<any> = /* #__PURE__ */ new Map()

export const mutate = /* #__PURE__ */ createMutate(globalCache)

export const defaultIsVisible = () => document.visibilityState === 'visible'
export const defaultIsOnline = () => navigator.onLine

export interface CacheLike<Data> {
  get(key: string): Data | undefined
  set(key: string, value: Data): void
  delete(key: string): void
  keys(): IterableIterator<string>
}

export interface UseRequestOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>> extends UseLoadingSlowFnOptions<D> {
  /**
   * Whether to manually trigger the request
   *
   * @defaultValue false
   */
  manual?: boolean
  /**
   * Initial parameters passed to fetcher when first mount
   *
   * @defaultValue []
   */
  initialParams?: Gettable<Promisable<Parameters<T>>>
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
  cacheKey?: string | ((...args: Parameters<T>) => string)
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
   * Register custom focus listener
   *
   * @defaultValue <use internal web behavior>
   */
  registerReFocus?: UseReFocusOptions['registerReFocus']
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
   * Register custom reconnect listener
   *
   * @defaultValue <use internal web behavior>
   */
  registerReconnect?: UseReConnectOptions['registerReConnect']
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

// pausable 实例控制的是所有内部的自动 refresh 行为（手动 run 和外部依赖变化除外）
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
  const provider = unwrapGettable(options.provider) || globalCache
  const cacheKeyValue = unwrapGettable(options.cacheKey)
  const cachedData = (cacheKeyValue ? globalCache.get(cacheKeyValue) : undefined) as D | undefined
  const versionRef = useRef(0)

  function setCache(value: D | undefined) {
    if (cacheKeyValue) {
      if (value) {
        provider.set(cacheKeyValue, value)
      } else {
        provider.delete(cacheKeyValue)
      }
    }
  }

  function runWhenVersionMatch(ver: number, fu: AnyFunc) {
    ver === versionRef.current && fu()
  }

  const latest = useLatest({
    setCache,
    fetcher,
    ...options,
    isVisible: options.isVisible ?? defaultIsVisible,
    isOnline: options.isOnline ?? defaultIsOnline,
  })

  const debounceOptions = isNumber(options.debounce) ? { wait: options.debounce } : options.debounce
  const throttleOptions = isNumber(options.throttle) ? { wait: options.throttle } : options.throttle

  const service = useLoadingSlowFn(
    useRetryFn(
      (async (...args) => {
        const version = ++versionRef.current
        runWhenVersionMatch(version, () => {
          if (latest.current.clearBeforeRun) {
            latest.current.setCache(undefined)
          }
        })
        const result = await latest.current.fetcher(...args)
        runWhenVersionMatch(version, () => latest.current.setCache(result))
        return result
      }) as T,
      {
        count: options.errorRetryCount,
        interval: options.errorRetryInterval,
        onError: options.onError,
        onErrorRetry: options.onErrorRetry,
      },
    ),
    {
      initialValue: cachedData ?? options.initialData,
      clearBeforeRun: options.clearBeforeRun,
      loadingTimeout: options.loadingTimeout,
      onLoadingSlow: options.onLoadingSlow,
      onBefore: (...args) => {
        intervalControls.resume()
        return options.onBefore?.(...args)
      },
      onSuccess: options.onSuccess,
      onFinally: options.onFinally,
    },
  )

  const serviceWithStatusCheck = useStableFn(async () => {
    if (!pausable.isActive()) return

    const { refreshWhenHidden, refreshWhenOffline, isVisible, isOnline } = latest.current

    const isVisibleMatch = (await isVisible()) || refreshWhenHidden
    const isOnlineMatch = (await isOnline()) || refreshWhenOffline

    if (isVisibleMatch && isOnlineMatch) return service.run()
  })

  const serviceWithRateControl = useThrottledFn(useDebouncedFn(service.run, debounceOptions), throttleOptions)

  const intervalControls = useIntervalFn(serviceWithStatusCheck, options.refreshInterval || 0, {
    immediate: !options.manual,
  })

  useReConnect(() => options.refreshOnReconnect && serviceWithStatusCheck(), {
    registerReConnect: options.registerReconnect,
  })

  useReFocus(() => options.refreshOnFocus && serviceWithStatusCheck(), {
    registerReFocus: options.registerReFocus,
    wait: options.refreshOnFocusThrottleWait,
  })

  const pausable = usePausable(
    true,
    () => {
      intervalControls.pause()
      service.cancel()
    },
    () => intervalControls.resume(),
  )

  useUpdateEffect(() => {
    service.run()
  }, [service.run, ...(options.refreshDependencies ?? [])])

  useMount(!options.manual && service.run)

  useUnmount(service.cancel)

  const mutateWithCache = useStableFn((action: SetStateAction<D | undefined>) => {
    const prevData = service.value
    const nextData = isFunction(action) ? action(prevData) : action
    service.mutate(nextData)
    latest.current.setCache(nextData)
  })

  return {
    ...pausable,
    run: serviceWithRateControl,
    cancel: service.cancel,
    mutate: mutateWithCache,
    get loadingSlow() {
      return service.loadingSlow
    },
    get data() {
      return service.value
    },
    get error() {
      return service.error
    },
    get loading() {
      return service.loading
    },
    get refreshing() {
      return Boolean(service.value && service.loading)
    },
    get initializing() {
      return Boolean(!service.value && service.loading)
    },
  }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type UseRequestMutate = (keyFilter: (key: string) => boolean, value: any) => void

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function createMutate(cache: CacheLike<any>): UseRequestMutate {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (keyFilter: Arrayable<string> | ((key: string) => boolean), value: SetStateAction<any>) => {
    const keys = isFunction(keyFilter)
      ? Array.from(cache.keys()).filter(keyFilter)
      : unwrapArrayable(keyFilter).filter(Boolean)

    for (const key of keys) {
      const prevData = cache.get(key)
      const nextData = isFunction(value) ? value(prevData) : value

      if (isDefined(key)) {
        cache.set(key, nextData)
      } else {
        cache.delete(key)
      }
    }
  }
}
