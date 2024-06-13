import { useAsyncFn } from '../use-async-fn'

import type { UseAsyncFnOptions, UseAsyncFnReturn } from '../use-async-fn'
import type { AnyFunc } from '../utils'

export interface UseLoadingFnOptions extends UseAsyncFnOptions {}
export interface UseLoadingFnReturn<T extends AnyFunc> extends UseAsyncFnReturn<T> {}

export function useLoadingFn<T extends AnyFunc>(fn: T, options: UseLoadingFnOptions = {}): UseLoadingFnReturn<T> {
  return useAsyncFn(fn, options)
}
