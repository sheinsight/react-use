import { useRef } from 'react'
import { useEffectOnce } from '../use-effect-once'
import { useStableFn } from '../use-stable-fn'

/**
 * A React Hook that returns a [Ref Getter](https://sheinsight.github.io/react-use/docs/features/ref-getter/) that indicates whether the component is mounted or not.
 */
export function useMounted(): () => boolean {
  const mountedRef = useRef<boolean>(false)

  useEffectOnce(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  })

  return useStableFn(() => mountedRef.current)
}
