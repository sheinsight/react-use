import { create } from '@shined/reactive'
import { useAsyncFn as useAsyncFnOrigin } from '../use-async-fn'

import type { ReactNode } from 'react'
import type { UseAsyncFnReturn } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseSingleLoadingProviderProps {
  children: ReactNode | undefined
}

export interface useAsyncFnExtendReturn<T extends AnyFunc> extends UseAsyncFnReturn<T> {
  /**
   * Set the loading state
   */
  setLoading: (value: boolean) => void
}

export interface CreateSingleLoadingReturn {
  /**
   * A Hook in React to use bound async function with loading state
   */
  useAsyncFn: <T extends AnyFunc>(func: T) => useAsyncFnExtendReturn<T>
  /**
   * A Hook in React to use loading state
   */
  useLoading(): boolean
  /**
   * Set the loading state via store in JS/TS
   */
  set: (value: boolean) => void
  /**
   * Get the loading state via store in JS/TS
   */
  get(): boolean
  /**
   * Bind the loading state to the async function in JS/TS
   */
  bind: <T extends AnyFunc>(func: T) => T
}

export interface CreateSingleLoadingOptions {
  /**
   * Whether set to false on error
   *
   * @default true
   */
  resetOnError?: boolean
  /**
   * Initial loading state
   *
   * @default false
   */
  initialState?: boolean
}

export function createSingleLoading(options: CreateSingleLoadingOptions = {}): CreateSingleLoadingReturn {
  const { resetOnError = true, initialState = false } = options
  const store = create({ loading: initialState })

  function bind<T extends AnyFunc>(func: T): T {
    return (async (...args: Parameters<T>) => {
      store.mutate.loading = true

      try {
        const result = await func(...args)
        store.mutate.loading = false
        return result
      } catch (error) {
        if (resetOnError) {
          store.mutate.loading = initialState
        }

        throw error
      } finally {
        // do nothing
      }
    }) as T
  }

  function get() {
    return store.mutate.loading
  }

  function set(value: boolean) {
    store.mutate.loading = value
  }

  function useLoading() {
    return store.useSnapshot((s) => s.loading)
  }

  function useAsyncFn<T extends AnyFunc>(asyncFunc: T) {
    const loading = useLoading()
    const { run, value, error } = useAsyncFnOrigin(bind(asyncFunc))

    return {
      run,
      value,
      loading,
      error,
      setLoading: set,
    }
  }

  return {
    useAsyncFn,
    useLoading,
    set,
    get,
    bind,
  }
}
