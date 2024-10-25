import { useAsyncFn } from '../use-async-fn'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingFnOptions<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseAsyncFnOptions<T, D, E> {}
export interface UseLoadingFnReturns<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>
  extends UseAsyncFnReturns<T, D, E> {}

/**
 * A React Hooks for handling loading state with ease, alias of [useAsyncFn](https://sheinsight.github.io/react-use/reference/use-async-fn).
 */
/* v8 ignore next 6 */
export function useLoadingFn<T extends AnyFunc, D = Awaited<ReturnType<T>>, E = any>(
  fn: T,
  options: UseLoadingFnOptions<T, D, E> = {},
): UseLoadingFnReturns<T, D, E> {
  return useAsyncFn<T, D, E>(fn, options)
}
