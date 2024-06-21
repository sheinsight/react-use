import { useAsyncFn } from '../use-async-fn'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingFnOptions extends UseAsyncFnOptions {}
export interface UseLoadingFnReturns<T extends AnyFunc> extends UseAsyncFnReturns<T> {}

/**
 * A React Hooks for handling loading state with ease, alias of [useAsyncFn](https://sheinsight.github.io/react-use/reference/use-async-fn).
 */
export function useLoadingFn<T extends AnyFunc>(fn: T, options: UseLoadingFnOptions = {}): UseLoadingFnReturns<T> {
  return useAsyncFn(fn, options)
}
