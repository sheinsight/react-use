import { useCounter } from '../use-counter'
import { useUpdateEffect } from '../use-update-effect'
import { unwrapGettable } from '../utils/unwrap'

import type { UseCounterReturnsAction } from '../use-counter'
import type { Gettable } from '../utils/basic'

export type UseClampReturns = readonly [number, UseCounterReturnsAction]

export function useClamp(value: Gettable<number>, min: Gettable<number>, max: Gettable<number>): UseClampReturns {
  const num = unwrapGettable(value)

  const [count, actions] = useCounter(num, {
    max: unwrapGettable(max),
    min: unwrapGettable(min),
  })

  useUpdateEffect(() => void actions.set(num), [num])

  return [count, actions] as const
}
