import { create } from '@shined/reactive'
import { getSnapshot } from '@shined/reactive/vanilla'
import { createContext, useContext } from 'react'
import { useCreation } from '../use-creation'
import { useStableFn } from '../use-stable-fn'
import { type AnyFunc, type Gettable, isFunction } from '../utils/basic'
import { unwrapGettable } from '../utils/unwrap'
import { type CacheLike, type UseRequestMutate, type UseRequestOptions, useRequest } from './index'

import type { Store } from '@shined/reactive'

const globalCache = new Map()

export function useRequestConfig<T extends AnyFunc, D = Awaited<ReturnType<T>>>(): UseRequestConfig<T, D> & {
  cache: CacheLike<D>
  mutate: UseRequestMutate
} {
  const config = useContext(useRequestConfigContext)
  const cache = useCreation(() => unwrapGettable(config.provider) || globalCache)
  const mutate = useStableFn(createMutate(cache))

  return { ...config, cache, mutate }
}

export type UseRequestConfig<T extends AnyFunc, D = Awaited<ReturnType<T>>> = Omit<
  UseRequestOptions<T, D>,
  'cacheKey' | 'initialParams' | 'initialData'
> & {
  // cacheKey 对应值的默认值 map 映射
  fallback?: Gettable<Record<string, D>>
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const useRequestConfigContext = createContext<UseRequestConfig<AnyFunc, any>>({})

export function UseRequestConfigProvider<T extends AnyFunc, D = Awaited<ReturnType<T>>>(props: {
  value: UseRequestConfig<T, D> | ((parentConfig: UseRequestConfig<T, D>) => UseRequestConfig<T, D>)
  children: React.ReactNode
}) {
  const { value, children } = props
  const parentConfig = useContext(useRequestConfigContext)
  const config = isFunction(value) ? value(parentConfig) : value
  const fallback = { ...parentConfig.fallback, ...config.fallback }
  const mergedConfig = { ...parentConfig, ...config, fallback }

  return <useRequestConfigContext.Provider value={mergedConfig}>{children}</useRequestConfigContext.Provider>
}

export function Root() {
  return (
    <UseRequestConfigProvider value={{ provider: () => new Map() }}>
      <div>Other Parts</div>
      <UseRequestConfigProvider
        value={(parentConfig) => {
          return {
            ...parentConfig,
            onError() {
              // do something
            },
          }
        }}
      >
        <App />
      </UseRequestConfigProvider>
    </UseRequestConfigProvider>
  )
}

function App() {
  const { run, data, error, mutate, cancel, loadingSlow, loading, initializing, refreshing, ...pausable } = useRequest(
    async (name: string) => {
      return 'fetcher returned value'
    },
  )

  pausable.isActive
  pausable.pause
  pausable.resume

  return (
    <div>
      <button type="button" disabled={loading} onClick={() => run('jack')}>
        run
      </button>
      {initializing && <div>initializing...</div>}
      {data && (
        <div>
          {data}
          {refreshing && <span className="spin" />}
        </div>
      )}
      {!!error && <div>Error occurred!</div>}
    </div>
  )
}

const store = create({
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  cache: [] as [key: string, data: any][],
  name: 2,
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const createReactiveProvider = (store: Store<any>) => ({
  get(key: string) {
    return getSnapshot(store.mutate.cache).find(([k]: [string]) => k === key)?.[1]
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  set(key: string, value: any) {
    const target = store.mutate.cache.find(([k]: [string]) => k === key)

    if (target) {
      target[1] = value
    } else {
      store.mutate.cache.push([key, value])
    }
  },
  delete(key: string) {
    const idx = store.mutate.cache.findIndex(([k]: [string]) => k === key)

    if (idx !== -1) {
      store.mutate.cache.splice(idx, 1)
    }
  },
  keys() {
    return store.mutate.cache.map(([k]: [string]) => k)
  },
})

const provider = createReactiveProvider(store)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function createMutate(cache: any): any {
  throw new Error('Function not implemented.')
}
