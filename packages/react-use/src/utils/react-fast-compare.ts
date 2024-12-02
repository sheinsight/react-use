import { isDev } from './basic'

const hasMap = typeof Map === 'function'
const hasSet = typeof Set === 'function'
const hasHTMLElementType = typeof HTMLElement !== 'undefined'
const hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView

/**
 * @description `react-fast-compare` rewritten using TypeScript
 * @from {@link https://github.com/FormidableLabs/react-fast-compare/blob/6f7d8afe02e4480c32f5af16f571367cccd47abc/index.js | react-fast-compare - GitHub}
 */
export function reactFastCompare(objA: unknown, objB: unknown) : boolean {
  try {
    return equal(objA, objB)
  } catch (error: any) {
    if ((error.message || '').match(/stack|recursion/i)) {
      if (isDev) console.warn('react-fast-compare cannot handle circular refs')
      return false
    }

    throw error
  }
}

function equal(objA: any, objB: any) {
  if (objA === objB) return true

  if (objA && objB && typeof objA === 'object' && typeof objB === 'object') {
    if (objA.constructor !== objB.constructor) return false

    let length
    let i
    let keys

    if (Array.isArray(objA)) {
      length = objA.length
      if (length !== objB.length) return false
      for (i = length; i-- !== 0; ) if (!equal(objA[i], objB[i])) return false
      return true
    }

    let it

    if (hasMap && objA instanceof Map && objB instanceof Map) {
      if (objA.size !== objB.size) return false
      it = objA.entries()
      while (!(i = it.next()).done) if (!objB.has(i.value[0])) return false
      it = objA.entries()
      while (!(i = it.next()).done) if (!equal(i.value[1], objB.get(i.value[0]))) return false
      return true
    }

    if (hasSet && objA instanceof Set && objB instanceof Set) {
      if (objA.size !== objB.size) return false
      it = objA.entries()
      while (!(i = it.next()).done) if (!objB.has(i.value[0])) return false
      return true
    }

    if (hasArrayBuffer && ArrayBuffer.isView(objA) && ArrayBuffer.isView(objB)) {
      length = (objA as any)?.length as never
      if (length !== (objB as any)?.length) return false
      for (i = length; i-- !== 0; ) if (objA[i] !== objB[i]) return false
      return true
    }

    if (objA.constructor === RegExp) return objA.source === objB.source && objA.flags === objB.flags

    if (
      objA.valueOf !== Object.prototype.valueOf &&
      typeof objA.valueOf === 'function' &&
      typeof objB.valueOf === 'function'
    )
      return objA.valueOf() === objB.valueOf()
    if (
      objA.toString !== Object.prototype.toString &&
      typeof objA.toString === 'function' &&
      typeof objB.toString === 'function'
    )
      return objA.toString() === objB.toString()

    keys = Object.keys(objA)
    length = keys.length
    if (length !== Object.keys(objB).length) return false

    for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(objB, keys[i])) return false

    if (hasHTMLElementType && objA instanceof HTMLElement) return false

    for (i = length; i-- !== 0; ) {
      if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && objA.$$typeof) {
        continue
      }

      if (!equal(objA[keys[i]], objB[keys[i]])) return false
    }

    return true
  }

  return objA !== objA && objB !== objB
}
