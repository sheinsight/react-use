import { useRef } from 'react'

/**
 * A React Hook that keep the previous value of a state.
 */
export function usePrevious<T = undefined>(state: T, isEqual: (p?: T, c?: T) => boolean = Object.is): T | undefined {
  const preRef = useRef<T>()
  const curRef = useRef<T>()

  if (!isEqual(curRef.current, state)) {
    preRef.current = curRef.current
    curRef.current = state
  }

  return preRef.current
}
