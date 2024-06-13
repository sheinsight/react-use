import { useRef } from 'react'
import { useStableFn } from '../use-stable-fn'

export type UseGetterRefReturn<T> = [
  /**
   * A mutable ref object that can be used to store a value.
   */
  ref: React.MutableRefObject<T>,
  /**
   * A getter function that returns the current value of the ref.
   */
  getter: () => T,
]

export function useGetterRef<T>(initial: T): UseGetterRefReturn<T> {
  const ref = useRef<T>(initial)
  const getter = useStableFn(() => ref.current)
  return [ref, getter] as const
}
