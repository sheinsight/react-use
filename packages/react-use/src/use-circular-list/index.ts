import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'
import { useSafeState } from '../use-safe-state'
import { useStableFn } from '../use-stable-fn'
import { useUpdateEffect } from '../use-update-effect'

export interface UseCycleListOptions<T, R extends T = T> {
  /**
   * Initial value
   */
  initialValue?: R
  /**
   * Fallback index when the value is not found
   */
  fallbackIndex?: number
  /**
   * Custom function to get the index of the value
   *
   * @param {T} value - `T`, the value to find
   * @param {T[]} list - `T[]`, the list to search
   * @returns {number} `number`, the index of the value
   */
  getIndexOf?: (value: T, list: T[]) => number
}

export type UseCycleListReturnsActions<T> = {
  /**
   * Move to the next value
   *
   * @param {number} [step] - `number`, the step to move
   * @returns {T} `T`, the next value
   */
  next: (step?: number) => T
  /**
   * Move to the previous value
   *
   * @param {number} [step] - `number`, the step to move
   * @returns {T} `T`, the previous value
   */
  prev: (step?: number) => T
  /**
   * Move to the value at the specified index
   *
   * @param {number} index - `number`, the index to move
   * @returns {T} `T`, the value at the specified index
   */
  go: (index: number) => T
}

export type UseCycleListReturns<T> = readonly [
  /**
   * Current value
   */
  state: T,
  /**
   * Actions to control the list
   */
  UseCycleListReturnsActions<T>,
  /**
   * Current index
   */
  index: number,
]

/**
 * A React Hook that helps to create a circular list that can cycle through the list.
 *
 * TODO: rewrite using `NoInfer` in TS 5.4, now downgrade temporarily
 *
 * @param {T[]} list - `T[]`, the list to cycle
 * @param {UseCycleListOptions} [options] - `UseCycleListOptions`, see {@link UseCycleListOptions}
 * @returns {UseCycleListReturns} `UseCycleListReturns`, see {@link UseCycleListReturns} and {@link UseCycleListReturnsActions}
 */
export function useCircularList<T, R extends T = T>(
  list: T[],
  options: UseCycleListOptions<T, R> = {},
): UseCycleListReturns<T> {
  const { initialValue = list[0], fallbackIndex = 0, getIndexOf } = options

  const latest = useLatest({ fallbackIndex, list, getIndexOf })

  const [state, setState] = useSafeState(() => {
    const index = getIndexOf ? getIndexOf(initialValue, list) : list.indexOf(initialValue)
    if (index < 0) return list[fallbackIndex]
    return list[index]
  })

  const getIndex = useStableFn(() => {
    const { list, getIndexOf, fallbackIndex } = latest.current
    let index = getIndexOf ? getIndexOf?.(state, list) : list.indexOf(state)
    if (index < 0) index = fallbackIndex
    return index
  })

  const setValueViaIndex = useStableFn((i: number) => {
    const { list } = latest.current
    const length = list.length
    const index = ((i % length) + length) % length
    const value = list[index]
    setState(value)
    return value
  })

  const shift = useStableFn((delta = 1) => setValueViaIndex(getIndex() + delta))
  const next = useStableFn((step = 1) => shift(step))
  const prev = useStableFn((step = 1) => shift(-step))

  // biome-ignore lint/correctness/useExhaustiveDependencies: effect need to re-run when list changes
  useUpdateEffect(() => void setValueViaIndex(getIndex()), [list])

  const index = getIndex()
  const actions = useCreation(() => ({ next, prev, go: setValueViaIndex }))

  return [state, actions, index] as const
}
