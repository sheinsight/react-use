import { describe, expect, it } from 'vitest'
import { reactFastCompare } from './react-fast-compare'

describe('reactFastCompare', () => {
  it('should return true for identical objects', () => {
    const objA = { a: 1, b: 2 }
    const objB = { a: 1, b: 2 }
    expect(reactFastCompare(objA, objB)).toBe(true)
  })

  it('should return false for different objects', () => {
    const objA = { a: 1, b: 2 }
    const objB = { a: 1, b: 3 }
    expect(reactFastCompare(objA, objB)).toBe(false)
  })

  it('should handle prototype inheritance', () => {
    const objA = Object.create({ a: 1 })
    const objB = Object.create({ a: 1 })
    expect(reactFastCompare(objA, objB)).toBe(true)

    const objC = Object.create({ a: 1 })
    const objD = Object.create({ b: 1 })
    expect(reactFastCompare(objC, objD)).toBe(true)
  })

  it('should return true for same regex', () => {
    const regexA = /test/i
    const regexB = /test/i
    expect(reactFastCompare(regexA, regexB)).toBe(true)
  })

  it('should handle HTMLElements', () => {
    const divA = document.createElement('div')
    const divB = document.createElement('div')
    expect(reactFastCompare(divA, divB)).toBe(false)
  })

  it('should return true for identical arrays', () => {
    const arrA = [1, 2, 3]
    const arrB = [1, 2, 3]
    expect(reactFastCompare(arrA, arrB)).toBe(true)
  })

  it('should return false for different arrays', () => {
    const arrA = [1, 2, 3]
    const arrB = [1, 2, 4]
    expect(reactFastCompare(arrA, arrB)).toBe(false)
  })

  it('should return false for different arrays length', () => {
    const arrA = [1, 2, 3]
    const arrB = [1, 2, 3, 4]
    expect(reactFastCompare(arrA, arrB)).toBe(false)
  })

  it('should return false for different object', () => {
    const obj = Object.create(null)
    const map = new Map()
    expect(reactFastCompare(obj, map)).toBe(false)
  })

  it('should handle circular references gracefully', () => {
    const objA: any = { a: 1 }
    objA.self = objA
    const objB: any = { a: 1 }
    objB.self = objB
    expect(reactFastCompare(objA, objB)).toBe(false)
  })

  it('should return true for identical Maps', () => {
    const mapA = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    const mapB = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    expect(reactFastCompare(mapA, mapB)).toBe(true)
  })

  it('should return true for different Maps with different size', () => {
    const mapA = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    const mapB = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
      ['key3', 'value3'],
    ])
    expect(reactFastCompare(mapA, mapB)).toBe(false)
  })

  it('should return true for different Maps with different keys', () => {
    const mapA = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    const mapB = new Map([
      ['key1', 'value1'],
      ['key3', 'value2'],
    ])
    expect(reactFastCompare(mapA, mapB)).toBe(false)
  })

  it('should return false for different Maps', () => {
    const mapA = new Map([
      ['key1', 'value1'],
      ['key2', 'value2'],
    ])
    const mapB = new Map([
      ['key1', 'value1'],
      ['key2', 'value3'],
    ])
    expect(reactFastCompare(mapA, mapB)).toBe(false)
  })

  it('should return true for identical Sets', () => {
    const setA = new Set(['value1', 'value2'])
    const setB = new Set(['value1', 'value2'])
    expect(reactFastCompare(setA, setB)).toBe(true)
  })

  it('should return false for different Sets', () => {
    const setA = new Set(['value1', 'value2'])
    const setB = new Set(['value1', 'value3'])
    expect(reactFastCompare(setA, setB)).toBe(false)
  })

  it('should return false for different Sets size', () => {
    const setA = new Set(['value1', 'value2'])
    const setB = new Set(['value1', 'value2', 'value3'])
    expect(reactFastCompare(setA, setB)).toBe(false)
  })

  it('should return true for identical ArrayBuffersView', () => {
    const viewA = new Int32Array([1, 2, 3])
    const viewB = viewA.slice(0)
    expect(reactFastCompare(viewA, viewB)).toBe(true)
  })

  it('should return false for identical ArrayBuffers', () => {
    const bufferA = new ArrayBuffer(8)
    const bufferB = bufferA.slice(0)
    expect(reactFastCompare(bufferA, bufferB)).toBe(false)
  })

  it('should return false for different ArrayBuffers', () => {
    const bufferA = new ArrayBuffer(8)
    const bufferB = new ArrayBuffer(8)
    expect(reactFastCompare(bufferA, bufferB)).toBe(false)
  })

  it('should handle throw Error', () => {
    const objA = {
      a: 1,
      b: {
        valueOf() {
          throw new Error('Error')
        },
      },
    }
    const objB = {
      a: 1,
      b: {
        valueOf() {
          throw new Error('Error')
        },
      },
    }

    expect(() => reactFastCompare(objA, objB)).toThrowError('Error')
  })

  it('should handle custom `toString`', () => {
    const objA = {
      a: 1,
      toString() {
        return 'custom'
      },
    }
    const objB = {
      a: 1,
      toString() {
        return 'custom'
      },
    }
    expect(reactFastCompare(objA, objB)).toBe(true)
  })

  it('should not handle `_owner` and `$$typeof` of react component', () => {
    const objA = { _owner: null, $$typeof: 'react' }
    const objB = { _owner: undefined, $$typeof: 'react' }
    expect(reactFastCompare(objA, objB)).toBe(true)
  })

  it('should not handle `__v` and `$$typeof` of react component', () => {
    const objC = { __v: null, $$typeof: 'react' }
    const objD = { __v: undefined, $$typeof: 'react' }
    expect(reactFastCompare(objC, objD)).toBe(true)
  })

  it('should not handle `__o` and `$$typeof` of react component', () => {
    const objE = { __o: null, $$typeof: 'react' }
    const objF = { __o: undefined, $$typeof: 'react' }
    expect(reactFastCompare(objE, objF)).toBe(true)
  })
})
