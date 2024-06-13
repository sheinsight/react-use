import { useKeyStroke, useLatest } from '..'

import type { KeyFilter, UseKeyStrokeHandler, UseKeyStrokeOptions } from '..'
import type { Noop } from '../utils'

export function useKeyStrokeOnce(
  key?: KeyFilter,
  handler?: UseKeyStrokeHandler,
  options?: Omit<UseKeyStrokeOptions, 'once'>,
): Noop {
  const latest = useLatest({ handler })

  const stopListen: Noop = useKeyStroke(
    key,
    (event) => {
      latest.current.handler?.(event)
      stopListen()
    },
    { ...options, once: true },
  )

  return stopListen
}
