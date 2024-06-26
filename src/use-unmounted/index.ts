import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useStableFn } from '../use-stable-fn'

/**
 * A React Hook that return a [Ref Getter](https://sheinsight.github.io/react-use/docs/features/ref-getter) that returns `true` if the component is unmounted.
 */
export function useUnmounted(): () => boolean {
  const unmountedRef = useRef<boolean>(false)

  useEffectOnce(() => {
    unmountedRef.current = false

    return () => {
      unmountedRef.current = true
    }
  })

  return useStableFn(() => unmountedRef.current)
}
