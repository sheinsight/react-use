import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useStableFn } from '../use-stable-fn'

export type UseUnmountedReturn = () => boolean

/**
 * Returns a function that returns whether the component is unmounted.
 */
export function useUnmounted(): UseUnmountedReturn {
  const unmountedRef = useRef<boolean>(false)

  useEffectOnce(() => {
    unmountedRef.current = false

    return () => {
      unmountedRef.current = true
    }
  })

  return useStableFn(() => unmountedRef.current)
}
