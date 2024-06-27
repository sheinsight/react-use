import { useRef } from 'react'
import { useDeepCompareEffect } from '../use-deep-compare-effect'
import { useLatest } from '../use-latest'
import { useStableFn } from '../use-stable-fn'
import { isString } from '../utils/basic'
import { unwrapArrayable, unwrapGettable, unwrapReffable } from '../utils/unwrap'

import type { Arrayable, Gettable, GettableOrReffable, Noop } from '../utils/basic'

export interface InferEventTarget<Events> {
  // biome-ignore lint/suspicious/noExplicitAny: need any
  addEventListener: (event: Events, fn?: any, options?: any) => any
  // biome-ignore lint/suspicious/noExplicitAny: need any
  removeEventListener: (event: Events, fn?: any, options?: any) => any
}

export type GeneralEventListener<E = Event> = (evt: E) => void

/**
 * A React Hook that use `EventListener` with ease.
 *
 * Register using `addEventListener` on mounted, and `removeEventListener` automatically on unmounted.
 */
// default window
export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>,
  listener: (this: Window, ev: WindowEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): Noop
// explicit window
export function useEventListener<E extends keyof WindowEventMap>(
  target: Gettable<Window>,
  event: Arrayable<E>,
  listener: (this: Document, ev: WindowEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): Noop
// explicit document
export function useEventListener<E extends keyof DocumentEventMap>(
  target: Gettable<DocumentOrShadowRoot>,
  event: Arrayable<E>,
  listener: (this: Document, ev: DocumentEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): Noop
// explicit HTML element
export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: GettableOrReffable<HTMLElement | null | undefined>,
  event: Arrayable<E>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => unknown,
  options?: boolean | AddEventListenerOptions,
): Noop
// custom target with event types inferred
export function useEventListener<E extends string, EventType = Event>(
  target: GettableOrReffable<InferEventTarget<E> | null | undefined>,
  event: Arrayable<E>,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions,
): Noop
// custom target and event fallback
export function useEventListener<EventType = Event>(
  target: GettableOrReffable<EventTarget | null | undefined>,
  event: Arrayable<string>,
  listener: GeneralEventListener<EventType>,
  options?: boolean | AddEventListenerOptions,
): Noop
// biome-ignore lint/suspicious/noExplicitAny: need any
export function useEventListener(...args: any[]) {
  let target: GettableOrReffable<EventTarget | null | undefined>
  let events: Arrayable<string>
  let listener: Noop
  let options: boolean | AddEventListenerOptions

  if (isString(args[0]) || Array.isArray(args[0])) {
    ;[events, listener, options] = args
    target = () => window
  } else {
    ;[target, events, listener, options] = args
  }

  const refTarget = unwrapReffable(target)
  const actualEvents = unwrapArrayable(events)

  const cleanups = useRef<Noop[]>([])
  const latest = useLatest({ listener })

  const cleanup = useStableFn(() => {
    for (const cleanup of cleanups.current) cleanup()
    cleanups.current.length = 0
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to detect ref.current change
  useDeepCompareEffect(() => {
    const actualTarget = unwrapReffable(unwrapGettable(target))

    if (!actualTarget || !actualEvents.length) return

    cleanups.current.push(
      ...actualEvents.flatMap((e) => {
        return addListener(actualTarget, e, (...args) => latest.current.listener(...args), options)
      }),
    )

    return cleanup
  }, [target, refTarget, actualEvents, options])

  return cleanup
}

function addListener(
  target: EventTarget,
  event: string,
  listener: Noop,
  options: boolean | AddEventListenerOptions | undefined,
): Noop {
  target.addEventListener(event, listener, options)

  return () => {
    target.removeEventListener(event, listener, options)
  }
}
