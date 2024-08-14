import { useRef } from 'react'

import type { MutableRefObject } from 'react'

/**
 * A React Hook that returns a ref to the latest value. It can be useful to prevent **stale state** in timer callback or async context.
 *
 * This React Hook writing `ref.current` during the render, which is not officially recommended, but is needed to avoid closure issues and it is predictable,
 *
 * provided that the useLatest value is not directly involved in rendering, it should ONLY be consumed during the effect phase.
 *
 * @see https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
 *
 * @see https://github.com/alibaba/hooks/issues/2495#issuecomment-1988915570
 */
export function useLatest<T>(value: T): MutableRefObject<T> {
  const latestRef = useRef<T>(value)

  // Prevent frequent updates when the value has not actually changed
  if (!Object.is(latestRef.current, value)) {
    latestRef.current = value
  }

  return latestRef
}
