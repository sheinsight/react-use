import { useAsyncFn as useAsyncFnOrigin } from '../use-async-fn'
import { isFunction } from '../utils/basic'

import type { create } from '@shined/reactive'
import type { UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseAsyncFnExtendReturns<T extends AnyFunc> extends UseAsyncFnReturns<T> {
  /**
   * Set the loading state
   *
   * @param {boolean} value - `boolean`, the loading value to set
   * @returns {void} `void`
   */
  setLoading: (value: boolean) => void
}

export interface CreateSingleLoadingReturns {
  /**
   * A Hook in React to use bound async function with loading state
   *
   * @param {AnyFunc} asyncFn - `AnyFunc`, the async function to bind, see {@link AnyFunc}
   * @returns {UseAsyncFnExtendReturns} see {@link UseAsyncFnExtendReturns}
   */
  useAsyncFn: <T extends AnyFunc>(asyncFn: T) => UseAsyncFnExtendReturns<T>
  /**
   * A Hook in React to use loading state
   *
   * @returns {boolean} `boolean`, the loading state
   */
  useLoading(): boolean
  /**
   * Set the loading state via store in JS/TS
   *
   * @param {boolean} value - `boolean`, the value to set
   * @returns {void} `void`
   */
  set: (value: boolean) => void
  /**
   * Get the loading state via store in JS/TS
   *
   * @returns {boolean} `boolean`, the loading state
   */
  get(): boolean
  /**
   * Bind the loading state to the async function in JS/TS
   *
   * @param {AnyFunc} asyncFn - `AnyFunc`, the async function to bind, see {@link AnyFunc}
   * @returns {AnyFunc} `AnyFunc`, same as `asyncFn` param, see {@link AnyFunc}
   */
  bind: <T extends AnyFunc>(asyncFn: T) => T
}

export interface CreateSingleLoadingOptions {
  /**
   * `Create` function of Reactive
   */
  create: typeof create
  /**
   * Whether set to false on error
   *
   * @defaultValue true
   */
  resetOnError?: boolean
  /**
   * Initial loading state
   *
   * @defaultValue false
   */
  initialState?: boolean
}

/**
 * A utility that provide a way to manage single (or global) loading state via multiple Hooks or simple JS/TS functions, using [Reactive](https://sheinsight.github.io/reactive/) under the hood.
 *
 * You need to install `@shined/reactive` to use this utility.
 *
 * @param {CreateSingleLoadingOptions} options {@link CreateSingleLoadingOptions}
 * @returns {CreateSingleLoadingReturns} `CreateSingleLoadingReturns`, single loading instance, see {@link CreateSingleLoadingReturns}
 *
 * @deprecated will be removed in the future, maybe moved to `@shined/reactive`
 *
 * @see {@link https://sheinsight.github.io/reactive/ | Reactive - Documentation}
 */
export function createSingleLoading(options: CreateSingleLoadingOptions): CreateSingleLoadingReturns {
  const { resetOnError = true, create, initialState = false } = options

  if (!isFunction(create)) {
    throw new Error('Please provide the `create` function from `@shined/reactive`')
  }

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

    return {
      ...useAsyncFnOrigin(bind(asyncFunc)),
      loading,
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
