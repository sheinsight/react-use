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
  if (isFunction(target)) return normalizeElement(unwrapGettable(target))

  if ([window, document].some((e) => e === target)) {
    return target
  }

  if (isString(target)) {
    return document.querySelector(target) || null
  }

  if (target instanceof HTMLElement || target instanceof SVGElement) {
    return target
  }

  return unwrapReffable(target) || null
}
