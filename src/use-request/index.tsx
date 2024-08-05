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
import type { Pausable } from '../use-pausable'
import type { UseRetryFnOptions } from '../use-retry-fn'
import type { ReactSetState } from '../use-safe-state'
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

export interface UseRequestOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>> {
  // 首次 mount 后立即执行，默认 false
  immediate?: boolean
  // 首次 mount 执行时传给 fetcher 的请求参数，默认 []
  // initialParams?: Gettable<Promisable<Parameters<T>>>
  // 初始数据 （for SSR） 默认 undefined
  initialData?: D | undefined
  // 缓存 key, 操作去重、单一 promise、数据缓存功能依赖于 cacheKey，默认 undefined，即不开启缓存
  cacheKey?: string | ((...args: Parameters<T>) => string)
  // 缓存提供者，默认为全局共享的 `new Map()`，可以设置为外部 store (reactive)、localStorage 等, 需要符合 CacheLike 接口定义
  provider?: Gettable<CacheLike<D>>

  // 节流 => 只对手动执行 run 方法的频率生效
  throttle?: UseThrottledFnOptions['wait'] | UseThrottledFnOptions
  // 防抖 => 只对手动执行 run 方法的频率生效
  debounce?: UseDebouncedFnOptions['wait'] | UseDebouncedFnOptions
  // 错误重试
  errorRetry?: Pick<UseRetryFnOptions, 'count' | 'interval'>

  // 是否在获得焦点时重新加载，默认关闭
  refreshOnFocus?: boolean
  // 获得焦点时重新加载的节流时间，默认 0，即关闭
  refreshOnFocusThrottleWait?: number
  // 自定义是否可见的判断函数
  isVisible?: () => Promisable<boolean>
  // 注册自定义焦点监听器
  registerReFocus?: (callback: AnyFunc) => void

  // 是否在网络重连时重新加载，默认关闭 => 内置行为，不受节流防抖限制
  refreshOnReconnect?: boolean
  // 自定义是否在线的判断函数
  isOnline?: () => Promisable<boolean>
  // 注册自定义重连监听器
  registerReconnect?: (callback: AnyFunc) => void

  // 定时重新验证时间间隔，默认 0，即关闭 => 内置行为，不受节流防抖限制
  refreshInterval?: Exclude<UseIntervalFnInterval, 'requestAnimationFrame'>
  // 是否在页面隐藏时重新验证，默认关闭 => isVisible 进行判断
  refreshWhenHidden?: boolean
  // 是否在离线时重新验证，默认关闭 => isOnline 进行判断
  refreshWhenOffline?: boolean

  // 重新刷新的依赖，当依赖变化时会触发刷新
  refreshDependencies?: DependencyList
  // 刷新前是否清空之前的数据和缓存
  clearBeforeRun?: boolean
  // 数据加载中的阈值，默认 0, 即关闭，超过该阈值会触发 onLoadingSlow 回调
  loadingTimeout?: number

  // 操作前回调
  onBefore?: () => void
  // 操作成功回调
  onSuccess?: (data: D) => void
  // 操作错误回调
  onError?: UseRetryFnOptions['onError']
  // 错误重试回调
  onErrorRetry?: UseRetryFnOptions['onError']
  // 操作完成回调
  onFinally?: (data: D | undefined) => void
  // 数据加载缓慢回调
  onLoadingSlow?: () => void
}

// pausable 实例控制的是所有内部的自动 refresh 行为（手动 run 和外部依赖变化除外）
export interface UseRequestReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>> extends Pausable {
  // 执行操作
  run: T
  // 抛弃当前操作，不会触发任何回调 （无法阻止 promise 执行，但阻止了后续逻辑）
  cancel: () => void
  // 返回的数据，可以在 options 里设置首次加载的数据
  data: D | undefined
  // 错误信息
  error: unknown
  // 修改数据
  mutate: ReactSetState<D | undefined>
  // 当前操作正在进行中
  loading: boolean
  // 是否正在初始化（无数据 + loading, initializing => !data && loading）
  initializing: boolean
  // 是否正在刷新数据（有数据 + loading，refreshing => data && loading）
  refreshing: boolean
  //是否数据加载缓慢
  loadingSlow: boolean
}

export function useRequest<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fetcher: T,
  options: UseRequestOptions<T, D> = {},
): UseRequestReturns<T, D> {
  const provider = unwrapGettable(options.provider) || globalCache
  const cacheKeyValue = unwrapGettable(options.cacheKey)
  const cachedData = (cacheKeyValue ? globalCache.get(cacheKeyValue) : undefined) as D | undefined

  function setCache(value: D | undefined) {
    if (cacheKeyValue) {
      if (value) {
        provider.set(cacheKeyValue, value)
      } else {
        provider.delete(cacheKeyValue)
      }
    }
  }

  const latest = useLatest({
    setCache,
    fetcher,
    ...options,
    isVisible: options.isVisible ?? defaultIsVisible,
    isOnline: options.isOnline ?? defaultIsOnline,
  })

  const versionRef = useRef(0)

  const debounceOptions = isNumber(options.debounce) ? { wait: options.debounce } : options.debounce
  const throttleOptions = isNumber(options.throttle) ? { wait: options.throttle } : options.throttle

  function runWhenVersionMatch(ver: number, fu: AnyFunc) {
    ver === versionRef.current && fu()
  }

  const service = useLoadingSlowFn(
    useRetryFn(
      (async () => {
        const version = ++versionRef.current
        runWhenVersionMatch(version, () => {
          if (latest.current.clearBeforeRun) {
            latest.current.setCache(undefined)
          }
        })
        const result = await latest.current.fetcher()
        runWhenVersionMatch(version, () => latest.current.setCache(result))
        return result
      }) as T,
      {
        ...options.errorRetry,
        onError(error, retryState) {
          options?.onError?.(error, { ...retryState })

          if (retryState.currentCount >= 1) {
            options.onErrorRetry?.(error, { ...retryState })
          }
        },
      },
    ),
    {
      initialValue: cachedData,
      clearBeforeRun: options.clearBeforeRun,
      onLoadingSlow: options.onLoadingSlow,
      loadingTimeout: options.loadingTimeout,
      onBefore: options.onBefore,
      onSuccess: options.onSuccess,
      onFinally: options.onFinally,
    },
  )

  const serviceWithStatusCheck = (async () => {
    const { refreshWhenHidden, refreshWhenOffline, isVisible, isOnline } = latest.current

    const isVisibleMatch = (await isVisible()) || refreshWhenHidden
    const isOnlineMatch = (await isOnline()) || refreshWhenOffline

    if (isVisibleMatch && isOnlineMatch) {
      return service.run()
    }
  }) as T

  const serviceWithStatusAndActiveCheck = useStableFn(() => pausable.isActive() && serviceWithStatusCheck())
  const serviceWithRateControl = useThrottledFn(useDebouncedFn(service.run, debounceOptions), throttleOptions)

  const intervalControls = useIntervalFn(serviceWithStatusAndActiveCheck, options.refreshInterval || 0)

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

  useUpdateEffect(() => service.run(), [service.run, ...(options.refreshDependencies ?? [])])

  useMount(options.immediate && service.run)

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
    loadingSlow: service.loadingSlow,
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
      return service.value && service.loading
    },
    get initializing() {
      return !service.value && service.loading
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
