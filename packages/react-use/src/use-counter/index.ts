import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { useUpdateEffect } from '../use-update-effect'
import { clamp } from '../utils/basic'

export type UseCounterOptions = {
  /**
   * The maximum value of the counter
   */
  max?: number
  /**
   * The minimum value of the counter
   */
  min?: number
}

export interface UseCounterReturnsAction {
  /**
   * Increment the counter
   */
  inc: (delta?: number) => void
  /**
   * Decrement the counter
   */
  dec: (delta?: number) => void
  /**
   * Set the counter
   */
  set: (value: number) => void
  /**
   * Get the counter
   */
  get(): number
  /**
   * Reset the counter
   */
  reset: (n?: number) => void
}

export interface UseCounterState {
  /**
   * The value of the counter
   */
  count: number
  /**
   * The maximum value of the counter
   */
  max: number
  /**
   * The minimum value of the counter
   */
  min: number
  /**
   * The initial value of the counter
   */
  initialCount: number
}

export type UseCounterReturns = readonly [
  /**
   * The count state of the counter
   */
  number,
  /**
   * Functions to control the counter
   */
  UseCounterReturnsAction,
  /**
   * The full internal state of the counter
   */
  UseCounterState,
]

/**
 * A React hook that provides a counter with increment, decrement, and reset functionalities.
 *
 * @param {number} [initialCount=0] - `number`, The initial value of the counter
 * @param {UseCounterOptions} [options] - `UseCounterOptions`, The options of the counter, see {@link UseCounterOptions}
 */
export function useCounter(initialCount?: number, options: UseCounterOptions = {}): UseCounterReturns {
  const [state, setState] = useSetState<UseCounterState>(
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
