import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { debounce as createDebouncedFn } from '../utils/debounce'

import type { AnyFunc } from '../utils/basic'
import type { DebounceOptions, DebouncedFn } from '../utils/debounce'

export interface UseDebouncedFnOptions extends DebounceOptions {}

/**
 * A React Hook that create a debounced function.
 */
export function useDebouncedFn<T extends AnyFunc, P extends Parameters<T>>(
  fn: T,
  options: UseDebouncedFnOptions = {},
): DebouncedFn<T> {
  const latest = useLatest({ fn })

  return useCreation(() => {
    const fnWrapper = ((...args: P) => latest.current.fn(...args)) as T
    return createDebouncedFn(fnWrapper, options)
  }, [options])
}
