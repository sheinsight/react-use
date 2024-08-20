import { useRef } from 'react'
import { useFirstRender } from '../use-first-render'
import { deepEqual } from '../utils/equal'

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
  /**
   * Whether to compare deeply, defaults to `false`.
   *
   * @defaultValue false
   */
  deep?: boolean
}

/**
 * A React Hook that retains the *different* value of the state from the last render.
 */
export function usePrevious<T = undefined>(state: T, options: UsePreviousOptions = {}): T | undefined {
  const preRef = useRef<T>()
  const curRef = useRef<T>()
  const isFirstRender = useFirstRender()

  const { deep = false, isEqual = deep ? deepEqual : Object.is } = options

  // ignore the first render & update the previous `different` value
  if (!isFirstRender && !isEqual(curRef.current, state)) {
    preRef.current = curRef.current
  }

  // reduce unnecessary reassignment
  if (!Object.is(curRef.current, state)) {
    curRef.current = state
  }

  return preRef.current
}
