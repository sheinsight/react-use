import { useAsyncFn } from '../use-async-fn'

import type { UseAsyncFnOptions, UseAsyncFnReturns } from '../use-async-fn'
import type { AnyFunc } from '../utils/basic'

export interface UseLoadingFnOptions extends UseAsyncFnOptions {}
export interface UseLoadingFnReturn<T extends AnyFunc> extends UseAsyncFnReturns<T> {}

export function useLoadingFn<T extends AnyFunc>(fn: T, options: UseLoadingFnOptions = {}): UseLoadingFnReturn<T> {
  return useAsyncFn(fn, options)
}
