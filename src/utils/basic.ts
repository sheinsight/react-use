import { version as ReactVersion } from 'react'

import type { DependencyList, EffectCallback } from 'react'

import type { RefObject } from 'react'

export type ExtendedReactEffect<T = unknown> = (effect: EffectCallback, deps?: DependencyList, ...args: T[]) => void

export type Noop = () => void
// biome-ignore lint/suspicious/noExplicitAny: any function
export type AnyFunc = (...args: any[]) => any
export type WithThis<T extends AnyFunc> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>

// biome-ignore lint/suspicious/noExplicitAny: any pure object
export type PureObject<T = any> = Record<PropertyKey, T>

export type Arrayable<T> = T | T[]
export type Gettable<T> = T | (() => T)
export type Reffable<T> = T | RefObject<T>
export type GettableOrReffable<T> = Gettable<T> | Reffable<T>

export type WindowEventName = keyof WindowEventMap
export type PointerType = 'mouse' | 'touch' | 'pen'

export type Position = {
  /**
   * X coordinate
   */
  x: number
  /**
   * Y coordinate
   */
  y: number
}

export type Size = {
  /**
   * Width of the element
   */
  width: number
  /**
   * Height of the element
   */
  height: number
}

export type SetTimeoutReturn = ReturnType<Window['setTimeout']>
export type SetIntervalReturn = ReturnType<Window['setInterval']>

declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | (string & {})
  }
}

// build tools are expected to replace this value when building for production
export const isDev = process.env.NODE_ENV !== 'production'

// useful in Server-side Rendering (SSR)
export const isClient = Boolean(typeof window !== 'undefined' && isFunction(window?.document?.createElement))

export function noop(): undefined {}

export function now(): number {
  return Date.now()
}

export function timestamp(): number {
  return +Date.now()
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

export function notNullish<T>(val: T | null): val is T {
  return val !== null && val !== undefined
}

export function isDefined<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}

export function isFunction<T extends AnyFunc>(val: unknown): val is T {
  return typeof val === 'function'
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}

export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export function isObject(val: unknown): val is object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function isReact18OrLater(): boolean {
  return Number(ReactVersion?.split('.')[0].trim()) >= 18
}

export function hasOwn<T extends object, K extends PropertyKey>(val: T, key: K): boolean {
  return Object.prototype.hasOwnProperty.call(val, key)
}

// TODO: rewrite using `NoInfer` in TS 5.4, now downgrade temporarily
export function ensureSSRSecurity<T, S extends T>(fn: () => T, fallback: S): T {
  return isClient ? fn() : fallback
}

export interface PromiseWithResolversReturns<T> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason: unknown) => void
  promise: Promise<T>
}

/**
 * TODO: re-write with `Promise.withResolvers`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers#browser_compatibility
 */
export function createPromiseWithResolvers<T = void>(): PromiseWithResolversReturns<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason: unknown) => void

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return { resolve, reject, promise }
}

/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */
export function increaseWithUnit<T extends number = number>(target: T, delta: number): T
export function increaseWithUnit<T extends string = string>(target: T, delta: number): T
export function increaseWithUnit<T extends string | number = string | number>(target: T, delta: number): T
export function increaseWithUnit(target: string | number, delta: number) {
  if (typeof target === 'number') return target + delta
  const value = target.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || ''
  const unit = target.slice(value.length)
  const result = Number.parseFloat(value) + delta
  if (Number.isNaN(result)) return target
  return result + unit
}

export function createSingletonPromise<T>(fn: () => Promise<T>) {
  const promise = {
    current: undefined as Promise<T> | undefined,
  }

  function wrapper() {
    if (!promise.current) {
      promise.current = fn()
    }
    return promise.current
  }

  wrapper.reset = async () => {
    const _prev = promise.current
    promise.current = undefined
    if (_prev) await _prev
  }

  return wrapper
}
