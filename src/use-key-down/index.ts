import { useKeyStroke } from '..'

import type { KeyFilter, UseKeyStrokeHandler, UseKeyStrokeOptions } from '..'
import type { Noop } from '../utils'

export function useKeyDown(
  key?: KeyFilter,
  handler?: UseKeyStrokeHandler,
  options: Omit<UseKeyStrokeOptions, 'eventName'> = {},
): Noop {
  return useKeyStroke(key, handler, { ...options, eventName: 'keydown' })
}
