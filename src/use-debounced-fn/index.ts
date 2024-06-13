import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { debounce as createDebouncedFn } from '../utils'

import type { AnyFunc, DebounceOptions } from '../utils'

export interface UseDebouncedFnOptions extends DebounceOptions {}

export function useDebouncedFn<T extends AnyFunc, P extends Parameters<T>>(
  fn: T,
  options: UseDebouncedFnOptions = {},
): T & { clear(): void } {
  const latestFn = useLatest(fn)

  return useCreation(() => {
    const fnWrapper = ((...args: P) => latestFn.current(...args)) as T
    return createDebouncedFn(fnWrapper, options)
  }, [options])
}
