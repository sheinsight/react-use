import { hasOwn } from '.'
import { reactFastCompare } from './react-fast-compare'

export function shallowEqual<T>(objA: T, objB: T) {
  if (Object.is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysLength = keysA.length

  if (keysLength !== Object.keys(objB).length) {
    return false
  }

  for (let i = 0; i < keysLength; i++) {
    if (!hasOwn(objB, keysA[i]) || !Object.is(objA[keysA[i] as keyof T], objB[keysA[i] as keyof T])) {
      return false
    }
  }

  return true
}

export function deepEqual<T>(objA: T, objB: T) {
  return reactFastCompare(objA, objB)
}
