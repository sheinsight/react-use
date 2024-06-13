import { useRef } from 'react'

import type { MutableRefObject } from 'react'

export function useLatest<T>(state: T): MutableRefObject<T> {
  const ref = useRef<T>(state)
  ref.current = state
  return ref
}
