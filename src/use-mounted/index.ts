import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useStableFn } from '../use-stable-fn'

export type UseMountedReturn = () => boolean

/**
 * Returns a function that returns whether the component is mounted.
 */
export function useMounted(): UseMountedReturn {
  const mountedRef = useRef<boolean>(false)

  useEffectOnce(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  })

  return useStableFn(() => mountedRef.current)
}
