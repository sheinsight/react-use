import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSetState } from '../use-set-state'
import { useStableFn } from '../use-stable-fn'
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
export function useCounter(initialCount: number = 0, options: UseCounterOptions = {}): UseCounterReturns {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options

  const [state, setState] = useSetState<UseCounterState>(
    {
      initialCount: initialCount,
      count: clamp(initialCount, min, max),
      max,
      min,
    },
    { deep: true },
  )

  const latest = useLatest(state)

  useUpdateEffect(() => {
    setState({ initialCount })
  }, [initialCount])

  useUpdateEffect(() => {
    const [max, min] = [options.max ?? Number.MAX_SAFE_INTEGER, options.min ?? Number.MIN_SAFE_INTEGER]
    setState((pre) => ({ count: clamp(pre.count, min, max), max, min }))
  }, [options.max, options.min])

  const inc = useStableFn((delta = 1) => {
    setState((pre) => ({ count: clamp(pre.count + delta, pre.min, pre.max) }))
  })

  const dec = useStableFn((delta = 1) => {
    setState((pre) => ({ count: clamp(pre.count - delta, pre.min, pre.max) }))
  })

  const set = useStableFn((value: number) => {
    setState((pre) => ({ count: clamp(value, pre.min, pre.max) }))
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
