import { useRef } from 'react'
import { useStableFn } from '../use-stable-fn'

import type { MutableRefObject } from 'react'

export type UseGetterRefReturnsGetter<T> = () => T

export type UseGetterRefReturns<T> = [
  /**
   * A mutable ref object that can be used to store a value.
   */
  ref: MutableRefObject<T>,
  /**
   * A getter function that returns the current value of the ref.
   */
  UseGetterRefReturnsGetter<T>,
]

/**
 * A React Hook that create a gettable ref, a function way to get the latest value of a ref.
 */
export function useGetterRef<T>(initial: T): UseGetterRefReturns<T> {
  const ref = useRef<T>(initial)
  const getter = useStableFn(() => ref.current)
  return [ref, getter] as const
}
