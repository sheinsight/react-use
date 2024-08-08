import { useCreation } from '../use-creation'
import { useEffectOnce } from '../use-effect-once'
import { useLatest } from '../use-latest'
import { useRender } from '../use-render'
import { useStableFn } from '../use-stable-fn'
import { isDefined, isFunction, isNumber } from '../utils/basic'
import { shallowEqual } from '../utils/equal'
import { unwrapArrayable, unwrapGettable } from '../utils/unwrap'

import type { SetStateAction } from 'react'
import type { AnyFunc, Arrayable, Gettable, SetTimeoutReturn } from '../utils/basic'

export interface CacheLike<Data> {
  get(key: string): Data | undefined
  set(key: string, value: Data): void
  delete(key: string): void
  keys(): IterableIterator<string>
}

const dataCache: CacheLike<unknown> = /* #__PURE__ */ new Map()
const paramsCache: Map<string, unknown[]> = /* #__PURE__ */ new Map()
const timerCache: Map<string, SetTimeoutReturn> = /* #__PURE__ */ new Map()
const promiseCache: Map<string, Promise<unknown>> = /* #__PURE__ */ new Map()

const cacheBus = createEventBus()

export function useRequestCache<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  options: {
    provider?: Gettable<CacheLike<D>>
    cacheKey?: string | ((...args: Parameters<T> | []) => string)
    cacheExpirationTime?: number | false
  } = {},
) {
  const render = useRender()
  const provider = unwrapGettable(options.provider) || dataCache
  const cacheKeyValue = unwrapGettable(options.cacheKey)
  const cachedData = (cacheKeyValue ? provider.get(cacheKeyValue) : undefined) as D | undefined
  const cachedParams = (cacheKeyValue ? paramsCache.get(cacheKeyValue) ?? [] : []) as Parameters<T> | []
  const cacheExpirationTime = options.cacheExpirationTime ?? 5 * 60_000

  const latest = useLatest({
    provider,
    cacheKeyValue,
    cacheExpirationTime,
  })

  useEffectOnce(() => {
    if (cacheKeyValue) {
      return cacheBus.on(cacheKeyValue, render)
    }
  })

  function resetCacheTimer() {
    const { provider, cacheKeyValue, cacheExpirationTime } = latest.current

    if (!cacheKeyValue || cacheExpirationTime === false) return

    const timer = timerCache.get(cacheKeyValue)

    if (timer) {
      clearTimeout(timer)
      timerCache.delete(cacheKeyValue)
    }

    if (isNumber(cacheExpirationTime)) {
      const timer = setTimeout(() => {
        provider.delete(cacheKeyValue)
        timerCache.delete(cacheKeyValue)
        cacheBus.emit(cacheKeyValue)
      }, cacheExpirationTime)

      timerCache.set(cacheKeyValue, timer)
    }
  }

  const setCache = useStableFn((value: D | undefined, params: Parameters<T> | [] = []) => {
    const { provider, cacheKeyValue } = latest.current

    if (!cacheKeyValue) return

    const preValue = provider.get(cacheKeyValue)
    const preParams = paramsCache.get(cacheKeyValue)

    if (shallowEqual(preValue, value) && shallowEqual(preParams, params)) return

    if (!isDefined(value)) {
      provider.delete(cacheKeyValue)
      timerCache.delete(cacheKeyValue)
    } else {
      provider.set(cacheKeyValue, value)
      resetCacheTimer()
    }

    paramsCache.set(cacheKeyValue, params)

    cacheBus.emit(cacheKeyValue)
  })

  const getPromiseCache = useStableFn(() => {
    const { cacheKeyValue } = latest.current
    if (!cacheKeyValue) return
    return promiseCache.get(cacheKeyValue)
  })

  const setPromiseCache = useStableFn((promise: Promise<D>) => {
    const { cacheKeyValue } = latest.current
    if (!cacheKeyValue) return
    promiseCache.set(cacheKeyValue, promise)
  })

  const clearPromiseCache = useStableFn(() => {
    const { cacheKeyValue } = latest.current
    if (!cacheKeyValue) return
    promiseCache.delete(cacheKeyValue)
  })

  const isCacheEnabled = useStableFn(() => Boolean(latest.current.cacheKeyValue))

  const actions = useCreation(() => ({
    setCache,
    getPromiseCache,
    setPromiseCache,
    clearPromiseCache,
    isCacheEnabled,
  }))

  return [{ cachedData, cachedParams }, actions] as const
}

export const mutate = /* #__PURE__ */ createMutate(dataCache)

export type UseRequestMutate = (keyFilter: (key: string) => boolean, value: unknown) => void

function createMutate(cache: CacheLike<unknown>): UseRequestMutate {
  return (keyFilter: Arrayable<string> | ((key: string) => boolean), value: SetStateAction<unknown>) => {
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

function createEventBus() {
  const listeners = new Map<string, Set<() => void>>()

  function on(eventName: string, listener: () => void) {
    const set = listeners.get(eventName) || new Set()
    set.add(listener)
    listeners.set(eventName, set)
    return () => off(eventName, listener)
  }

  function off(eventName: string, listener: () => void) {
    const set = listeners.get(eventName)
    if (!set) return
    set.delete(listener)
    if (set.size === 0) listeners.delete(eventName)
  }

  function emit(eventName: string) {
    const set = listeners.get(eventName)
    if (!set) return
    for (const listener of set) listener()
  }

  return { on, emit }
}
