import { describe, expect, it } from 'vitest'
import { unwrapArrayable, unwrapGettable, unwrapPromisable, unwrapReffable } from './unwrap'

describe('unwrapGettable', () => {
  it('should return the value if it is not a function', () => {
    const result = unwrapGettable(42)
    expect(result).toBe(42)
  })

  it('should call the function and return its result', () => {
    const fn = () => 42
    const result = unwrapGettable(fn)
    expect(result).toBe(42)
  })
})

describe('unwrapArrayable', () => {
  it('should return the array if input is an array', () => {
    const result = unwrapArrayable([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('should return an array containing the value if input is not an array', () => {
    const result = unwrapArrayable(1)
    expect(result).toEqual([1])
  })
})

describe('unwrapReffable', () => {
  it('should return the current value if input is a ref object', () => {
    const ref = { current: 42 }
    const result = unwrapReffable(ref)
    expect(result).toBe(42)
  })

  it('should return the value if input is not a ref object', () => {
    const result = unwrapReffable(42)
    expect(result).toBe(42)
  })
})

describe('unwrapPromisable', () => {
  it('should return the value if it is not a promise', async () => {
    const result = await unwrapPromisable(42)
    expect(result).toBe(42)
  })

  it('should await the promise and return its resolved value', async () => {
    const promise = Promise.resolve(42)
    const result = await unwrapPromisable(promise)
    expect(result).toBe(42)
  })

  it('should handle nested promises', async () => {
    const promise = Promise.resolve(Promise.resolve(42))
    const result = await unwrapPromisable(promise)
    expect(result).toBe(42)
  })
})
