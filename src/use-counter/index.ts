import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { useUpdateEffect } from '../use-update-effect'
import { clamp } from '../utils/basic'

export interface UseCounterOptions {
  /**
   * the maximum value of the counter
   */
  max?: number
  /**
   * the minimum value of the counter
   */
  min?: number
}

export type Count = number

export interface UseCounterReturnsAction {
  /**
   * increment the counter
   */
  inc: (delta?: number) => void
  /**
   * decrement the counter
   */
  dec: (delta?: number) => void
  /**
   * set the counter
   */
  set: (value: number) => void
  /**
   * get the counter
   */
  get(): number
  /**
   * reset the counter
   */
  reset: (n?: number) => void
}

export type UseCounterReturns = readonly [
  /**
   * The count state of the counter
   */
  Count,
  /**
   * The actions to control the counter
   */
  UseCounterReturnsAction,
  /**
   * The whole state of the counter
   */
  {
    count: number
    max: number
    min: number
    initialCount: number
  },
]

/**
 * A React Hook that provides a counter with increment, decrement and reset functions.
 */
export function useCounter(initialCount?: number, options: UseCounterOptions = {}): UseCounterReturns {
  const [state, setState] = useSetState(
    {
      initialCount: initialCount ?? 0,
      count: initialCount ?? 0,
      max: options.max ?? Number.POSITIVE_INFINITY,
      min: options.min ?? Number.NEGATIVE_INFINITY,
    },
    { deep: true },
  )

  const latest = useLatest(state)

  useUpdateEffect(() => void setState({ initialCount: initialCount ?? 0 }), [initialCount])

  useUpdateDeepCompareEffect(() => {
    const [max, min] = [options.max ?? Number.POSITIVE_INFINITY, options.min ?? Number.NEGATIVE_INFINITY]
    const count = clamp(latest.current.count, min, max)
    setState({ count, max, min })
  }, [options])

  const inc = useStableFn((delta = 1) => {
    const { max, min, count } = latest.current
    setState({ count: clamp(count + delta, min, max) })
  })

  const dec = useStableFn((delta = 1) => {
    const { max, min, count } = latest.current
    setState({ count: clamp(count - delta, min, max) })
  })

  const set = useStableFn((value: number) => {
    const { max, min } = latest.current
    setState({ count: clamp(value, min, max) })
  })

  const get = useStableFn(() => latest.current.count)

  const reset = useStableFn((n = latest.current.initialCount) => {
    setState({
      initialCount: n,
      count: clamp(n, latest.current.min, latest.current.max),
    })
  })

  const actions = useCreation(() => ({ inc, dec, set, get, reset }))

  return [state.count, actions, state] as const
}
