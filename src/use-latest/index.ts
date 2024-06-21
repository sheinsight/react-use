import { useRef } from 'react'

import type { MutableRefObject } from 'react'

/**
 * A React Hook that returns a ref to the latest value. It can be useful to prevent **stale state** in timer callback or async context.
 */
export function useLatest<T>(state: T): MutableRefObject<T> {
  const ref = useRef<T>(state)
  ref.current = state
  return ref
}
