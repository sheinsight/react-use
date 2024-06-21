import { useSafeState } from '../use-safe-state'
import { useUpdateDeepCompareEffect } from '../use-update-deep-compare-effect'
import { useUpdateEffect } from '../use-update-effect'
import { timestamp } from '../utils/basic'

export interface UseLastChangedOptions {
  /**
   * The initial value of the last updated timestamp.
   *
   * @defaultValue null
   */
  initialValue?: number | null
  /**
   * If `true`, deep compares the source object.
   *
   * @defaultValue false
   */
  deep?: boolean
}

/**
 * A React Hook that record the last updated time of a state.
 */
export function useLastUpdated<T = unknown>(source: T, options?: UseLastChangedOptions): number | null {
  const { initialValue = null, deep = false } = options ?? {}
  const [updatedAt, setUpdatedAt] = useSafeState<number | null>(initialValue)

  useUpdateEffect(() => void setUpdatedAt(timestamp()), deep ? [] : [source])
  useUpdateDeepCompareEffect(() => void setUpdatedAt(timestamp()), deep ? [source] : [])

  return updatedAt
}
