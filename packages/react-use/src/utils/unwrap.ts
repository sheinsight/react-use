import { isFunction, isObject } from './basic'

export function unwrapGettable<T>(val: T | (() => T)): T {
  return isFunction(val) ? val() : val
}

export function unwrapArrayable<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val]
}

export function unwrapReffable<T>(val: T | { current: T }): T {
  return isObject(val) && 'current' in val ? val.current : val
}

export async function unwrapPromisable<T>(val: T | Promise<T>): Promise<T> {
  return val instanceof Promise ? await val : val
}
