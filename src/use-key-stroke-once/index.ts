import { useKeyStroke } from '../use-key-stroke'
import { useLatest } from '../use-latest'

import type { KeyFilter, UseKeyStrokeHandler, UseKeyStrokeOptions } from '../use-key-stroke'
import type { Noop } from '../utils/basic'

export function useKeyStrokeOnce(
  key?: KeyFilter,
  handler?: UseKeyStrokeHandler,
  options?: Omit<UseKeyStrokeOptions, 'once'>,
): Noop {
  const latest = useLatest({ handler })

  return useKeyStroke(
    key,
    (event) => {
      latest.current.handler?.(event)
    },
    { ...options, once: true },
  )
}
