import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'

/**
 * A React Hook that helps to create a ref that can be checked if the component is unmounted.
 */
export function useUnmountedRef() {
  const unmountedRef = useRef(false)

  useEffectOnce(() => {
    unmountedRef.current = false

    return () => {
      unmountedRef.current = true
    }
  })

  return unmountedRef
}
