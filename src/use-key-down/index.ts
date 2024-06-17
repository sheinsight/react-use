import { useKeyStroke } from '../use-key-stroke'

import type { KeyFilter, UseKeyStrokeHandler, UseKeyStrokeOptions } from '../use-key-stroke'
import type { Noop } from '../utils/basic'

export function useKeyDown(
  key?: KeyFilter,
  handler?: UseKeyStrokeHandler,
  options: Omit<UseKeyStrokeOptions, 'eventName'> = {},
): Noop {
  return useKeyStroke(key, handler, { ...options, eventName: 'keydown' })
}
