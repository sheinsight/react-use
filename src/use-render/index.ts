import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'

import type { Noop } from '../utils'

export function useRender(): Noop {
  const [_, setState] = useSafeState({})
  return useStableFn(() => setState({}))
}
