import { useEffect, useRef } from 'react'

interface UsePreviousOptions {
  /**
   * An `isEqual` function used to compare whether the previous value is equal to the current value, defaults to `Object.is`.
   *
   * @param previous The previous value.
   * @param current The current value.
   * @returns Returns `true` if equal, otherwise returns `false`.
   *
   * @defaultValue `Object.is`
   */
  isEqual?(previous: any, current: any): boolean
}

/**
 * A React Hook that retains the *different* value of the state from the last render.
 */
export function usePrevious<T = undefined>(state: T, options: UsePreviousOptions = {}): T | undefined {
  const preRef = useRef<T>()
  const curRef = useRef<T>()

  const { isEqual = Object.is } = options

  useEffect(() => {
    if (!isEqual(curRef.current, state)) {
      preRef.current = curRef.current
      curRef.current = state
    }
  })

  return preRef.current
}
