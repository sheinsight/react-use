import { isFunction, isString } from '../utils/basic'
import { unwrapGettable, unwrapReffable } from '../utils/unwrap'

import type { MutableRefObject, RefObject } from 'react'
import type { Gettable } from '../utils/basic'

export type AtomBaseTarget = Element | null
export type GlobalTarget = Window | Document

export type BaseTarget<T extends AtomBaseTarget = AtomBaseTarget> =
  | MutableRefObject<T | undefined | null>
  | Parameters<Document['querySelector']>[0]
  | T
  | undefined
  | null

export type ElementTarget<T extends AtomBaseTarget = AtomBaseTarget> = Gettable<BaseTarget<T>> | false

export function normalizeElement<T extends GlobalTarget>(target: Gettable<T>): T
export function normalizeElement<T extends Element | null>(target: Gettable<T | RefObject<T>>): T
export function normalizeElement<T extends keyof HTMLElementTagNameMap>(target: Gettable<T>): HTMLElementTagNameMap[T]
export function normalizeElement<T extends keyof SVGElementTagNameMap>(target: Gettable<T>): SVGElementTagNameMap[T]
export function normalizeElement<
  A extends AtomBaseTarget = AtomBaseTarget,
  T extends ElementTarget<A> = ElementTarget<A>,
>(target: T): A | null
export function normalizeElement(target: unknown) {
  if (isFunction(target)) {
    return normalizeElement(unwrapGettable(target))
  }

  const unrefValue = unwrapReffable(target)

  if (
    [typeof window !== 'undefined' ? window : null, typeof document !== 'undefined' ? document : null]
      .filter((e) => Boolean(e))
      .some((e) => e === unrefValue)
  ) {
    return unrefValue
  }

  if (isString(unrefValue)) {
    return typeof document !== 'undefined' && 'querySelector' in document
      ? document.querySelector(unrefValue) || null
      : null
  }

  if (
    (
      [
        typeof HTMLElement !== 'undefined' ? HTMLElement : null,
        typeof SVGElement !== 'undefined' ? SVGElement : null,
      ].filter((e) => Boolean(e)) as (typeof HTMLElement | typeof SVGElement)[]
    ).some((classConstructor) => unrefValue instanceof classConstructor)
  ) {
    return unrefValue
  }

  return unrefValue || null
}
