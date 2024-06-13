import { useRef } from 'react'

export function usePrevious<T = undefined>(state: T, isEqual: (p?: T, c?: T) => boolean = Object.is): T | undefined {
  const preRef = useRef<T>()
  const curRef = useRef<T>()

  if (!isEqual(curRef.current, state)) {
    preRef.current = curRef.current
    curRef.current = state
  }

  return preRef.current
}
