import { useAsyncFn } from '../use-async-fn'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>> extends UseAsyncFnOptions<T, D> {}
export interface UseLoadingFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>> extends UseAsyncFnReturns<T, D> {}

/**
 * A React Hooks for handling loading state with ease, alias of [useAsyncFn](https://sheinsight.github.io/react-use/reference/use-async-fn).
 */
export function useLoadingFn<T extends AnyFunc, D = Awaited<ReturnType<T>>>(
  fn: T,
  options: UseLoadingFnOptions<T, D> = {},
): UseLoadingFnReturns<T, D> {
  return useAsyncFn(fn, options)
}
