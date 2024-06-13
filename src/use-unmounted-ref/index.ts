import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'

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
