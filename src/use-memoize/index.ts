import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'

type CacheKey = PropertyKey

export interface UseMemoizeCache<Key, Value> {
  get: (key: Key) => Value | undefined
  set: (key: Key, value: Value) => void
  has: (key: Key) => boolean
  delete: (key: Key) => void
  clear(): void
}

export interface UseMemoizeOptions<Result, Args extends unknown[]> {
  /**
   * Custom cache key generator
   *
   * @defaultValue JSON.stringify(args)
   */
  getKey?: (...args: Args) => string | number
  /**
   * Custom cache, can be a Map or other object that implements the cache interface
   *
   * @defaultValue new Map()
   */
  cache?: UseMemoizeCache<CacheKey, Result>
}

export interface UseMemoizeReturns<Result, Args extends unknown[]> {
  /**
   * Memoized function
   */
  (...args: Args): Result
  /**
   * Load data and replace the cache with the new value
   */
  load: (...args: Args) => Result
  /**
   * Delete cache by args
   */
  delete: (...args: Args) => void
  /**
   * Clear all cache
   */
  clear(): void
  /**
   * Get cache key by args
   */
  getKey: (...args: Args) => CacheKey
  /**
   * A map-like cache object, you can use it to manipulate the cache directly
   */
  cache: UseMemoizeCache<CacheKey, Result>
}

/**
 * A React Hook that return a function that memoize value (return same memoized value for same arguments).
 */
export function useMemoize<Result, Args extends unknown[]>(
  resolver: (...args: Args) => Result,
  options: UseMemoizeOptions<Result, Args> = {},
): UseMemoizeReturns<Result, Args> {
  const cache = useCreation((): UseMemoizeCache<CacheKey, Result> => {
    if (options?.cache) return options.cache
    return new Map<CacheKey, Result>()
  }, [options?.cache])

  const latest = useLatest({ ...options, cache })

  const getKey = useStableFn((...args: Args) => {
    const { getKey } = latest.current
    return getKey ? getKey(...args) : JSON.stringify(args)
  })

  const _loadData = useStableFn((key: string | number, ...args: Args): Result => {
    latest.current.cache.set(key, resolver(...args))
    return latest.current.cache.get(key) as Result
  })

  const loadData = useStableFn((...args: Args) => _loadData(getKey(...args), ...args))

  const deleteData = useStableFn((...args: Args) => {
    latest.current.cache.delete(getKey(...args))
  })

  const clearData = useStableFn(() => cache.clear())

  const memoized: Partial<UseMemoizeReturns<Result, Args>> = (...args: Args): Result => {
    const key = getKey(...args)
    if (latest.current.cache.has(key)) {
      return latest.current.cache.get(key) as Result
    }
    return _loadData(key, ...args)
  }

  memoized.load = loadData
  memoized.delete = deleteData
  memoized.clear = clearData
  memoized.getKey = getKey
  memoized.cache = cache

  return memoized as UseMemoizeReturns<Result, Args>
}
