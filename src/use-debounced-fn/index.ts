import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { debounce as createDebouncedFn } from '../utils/debounce'

import type { AnyFunc } from '../utils/basic'
import type { DebounceOptions } from '../utils/debounce'

export interface UseDebouncedFnOptions extends DebounceOptions {}

/**
 * A React Hook that create a debounced function.
 */
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
