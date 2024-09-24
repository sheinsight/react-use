import { describe, expect, it } from 'vitest'
import { deepEqual, shallowEqual } from './equal'

describe('shallowEqual', () => {
  it('should return true for identical objects', () => {
    const obj = { a: 1, b: 2 }
    expect(shallowEqual(obj, obj)).toBe(true)
  })

  it('should return true for shallowly equal objects', () => {
    const objA = { a: 1, b: 2 }
    const objB = { a: 1, b: 2 }
    expect(shallowEqual(objA, objB)).toBe(true)
  })

  it('should return false for objects with different properties', () => {
    const objA = { a: 1, b: 2 }
    const objB = { a: 1, b: 3 }
    expect(shallowEqual(objA, objB)).toBe(false)
  })

  it('should return true for same basic value', () => {
    expect(shallowEqual(1, 1)).toBe(true)
    expect(shallowEqual(null, null)).toBe(true)
    expect(shallowEqual(undefined, undefined)).toBe(true)
  })

  it('should return true for different object references but "same" value', () => {
    const objA = { a: 1 }
    const objB = { a: 1 }
    expect(shallowEqual(objA, objB)).toBe(true)
  })
})

describe('deepEqual', () => {
  it('should return true for identical objects', () => {
    const obj = { a: { b: 2 } }
    expect(deepEqual(obj, obj)).toBe(true)
  })

  it('should return true for deeply equal objects', () => {
    const objA = { a: { b: 2 } }
    const objB = { a: { b: 2 } }
    expect(deepEqual(objA, objB)).toBe(true)
  })

  it('should return false for objects with different nested properties', () => {
    const objA = { a: { b: 2 } }
    const objB = { a: { b: 3 } }
    expect(deepEqual(objA, objB)).toBe(false)
  })

  it('should return true for different object references but "same" value', () => {
    const objA = { a: { b: 2 } }
    const objB = { a: { b: 2 } }
    expect(deepEqual(objA, objB)).toBe(true)
  })

  it('should return true for same basic value', () => {
    expect(deepEqual(1, 1)).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
    expect(deepEqual(undefined, undefined)).toBe(true)
  })
})
