import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { Noop } from '../utils/basic'

/**
 * A React Hook that return a function to re-render component. Helpful when you need to re-render a component without changing the state.
 */
export function useRender(): Noop {
  const [_, setState] = useSafeState({})
  return useStableFn(() => setState({}))
}
