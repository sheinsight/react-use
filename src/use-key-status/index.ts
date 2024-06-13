import { useKeyDown, useKeyUp, useLatest, useSafeState } from '..'

import type { KeyFilter, UseKeyStrokeHandler, UseKeyStrokeOptions } from '..'

export interface UseKeyStatusHandler extends UseKeyStrokeHandler {}
export interface UseKeyStatusOptions extends Omit<UseKeyStrokeOptions, 'eventName' | 'dedupe'> {}

export function useKeyStatus(
  key?: KeyFilter,
  handler?: UseKeyStatusHandler,
  options: UseKeyStatusOptions = {},
): boolean {
  const [isPressed, setPressed] = useSafeState(false)
  const latest = useLatest({ handler })

  useKeyDown(
    key,
    (e) => {
      setPressed(true)
      latest.current.handler?.(e)
    },
    { ...options, dedupe: true },
  )

  useKeyUp(
    key,
    (e) => {
      setPressed(false)
      latest.current.handler?.(e)
    },
    { ...options, dedupe: true },
  )

  return isPressed
}
