import { useRef } from 'react'
import { useCreation } from '../use-creation'
import { useEventListener } from '../use-event-listener'
import { useStableFn } from '../use-stable-fn'
import { useTargetElement } from '../use-target-element'
import { isFunction, isObject, isString } from '../utils/basic'

import type { ElementTarget } from '../use-target-element'
import type { Noop } from '../utils/basic'

export type KeyPredicate = (event: KeyboardEvent) => boolean
export type KeyFilter = true | string | string[] | KeyPredicate
export type KeyStrokeEventName = 'keydown' | 'keypress' | 'keyup'

export interface UseKeyStrokeOptions {
  /**
   * The event name to listen for.
   *
   * @defaultValue 'keydown'
   */
  eventName?: KeyStrokeEventName
  /**
   * The target to add the event listener to.
   *
   * @defaultValue window
   */
  target?: ElementTarget | (() => Window) | (() => Document)
  /**
   * Set to `true` to use passive event listeners.
   *
   * @defaultValue false
   */
  passive?: boolean
  /**
   * Set to `true` to ignore repeated events when the key is being held down.
   *
   * @defaultValue false
   */
  dedupe?: boolean
  /**
   * Set to `true` to remove the event listener after the first event.
   *
   * @defaultValue false
   */
  once?: boolean
}

function createKeyPredicate(keyFilter?: KeyFilter): KeyPredicate {
  switch (true) {
    case isFunction(keyFilter):
      return keyFilter
    case isString(keyFilter):
      return (event: KeyboardEvent) => event.key === keyFilter
    case Array.isArray(keyFilter):
      return (event: KeyboardEvent) => keyFilter.includes(event.key)
    default:
      return () => true
  }
}

export type UseKeyStrokeHandler = (event: KeyboardEvent) => void

/**
 * A React Hook that helps to handle key strokes.
 */
export function useKeyStroke(key?: KeyFilter, handler?: UseKeyStrokeHandler, options?: UseKeyStrokeOptions): Noop
export function useKeyStroke(handler?: UseKeyStrokeHandler, options?: UseKeyStrokeOptions): Noop
export function useKeyStroke(...args: any[]) {
  const key = useRef<KeyFilter>(undefined)
  const handler = useRef<UseKeyStrokeHandler>(undefined)
  const options = useRef<UseKeyStrokeOptions>(undefined)

  if (args.length === 3) {
    ;[key.current, handler.current, options.current] = args
  } else if (args.length === 2) {
    if (isObject(args[1])) {
      key.current = true
      ;[handler.current, options.current] = args
    } else {
      ;[key.current, handler.current] = args
    }
  } else {
    key.current = true
    handler.current = args[0]
  }

  options.current ??= {}

  const predicate = useCreation(() => createKeyPredicate(key.current), [key.current])

  const listener = useStableFn((e: KeyboardEvent) => {
    if (e.repeat && (options.current?.dedupe ?? false)) return
    predicate(e) && handler.current?.(e)
  })

  const { target = () => window, eventName = 'keydown', passive = false, once = false } = options.current

  const el = useTargetElement(target)
  const stop = useEventListener(el, eventName, listener, { passive, once })

  return stop
}
