import { describe, expect, it, vi } from 'vitest'
import {
  clamp,
  createPromiseWithResolvers,
  createSingletonPromise,
  hasOwn,
  increaseWithUnit,
  isBoolean,
  isDefined,
  isFunction,
  isNumber,
  isObject,
  isReact18OrLater,
  isString,
  noNullish,
  noop,
  now,
  wait,
} from './basic'

describe('utils/basic', () => {
  describe('noop', () => {
    it('should return undefined', () => {
      expect(noop()).toBeUndefined()
    })
  })

  describe('wait', () => {
    it('should resolve after specified time', async () => {
      const start = now()
      await wait(100)
      const end = now()
      expect(end - start).toBeGreaterThanOrEqual(100)
    })
  })

  describe('clamp', () => {
    it('should clamp value between min and max', () => {
      expect(clamp(5, 1, 10)).toBe(5)
      expect(clamp(0, 1, 10)).toBe(1)
      expect(clamp(15, 1, 10)).toBe(10)
    })
  })

  describe('noNullish', () => {
    it('should return true for defined values', () => {
      expect(noNullish(1)).toBe(true)
      expect(noNullish('test')).toBe(true)
    })

    it('should return false for null or undefined', () => {
      expect(noNullish(null)).toBe(false)
      expect(noNullish(undefined)).toBe(false)
    })
  })

  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(1)).toBe(true)
      expect(isDefined('test')).toBe(true)
    })

    it('should return false for undefined', () => {
      expect(isDefined(undefined)).toBe(false)
    })
  })

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true)
    })

    it('should return false for non-functions', () => {
      expect(isFunction(1)).toBe(false)
      expect(isFunction(null)).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(1)).toBe(true)
    })

    it('should return false for non-numbers', () => {
      expect(isNumber('1')).toBe(false)
    })
  })

  describe('isBoolean', () => {
    it('should return true for booleans', () => {
      expect(isBoolean(true)).toBe(true)
    })

    it('should return false for non-booleans', () => {
      expect(isBoolean(1)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('test')).toBe(true)
    })

    it('should return false for non-strings', () => {
      expect(isString(1)).toBe(false)
    })
  })

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true)
    })

    it('should return false for non-objects', () => {
      expect(isObject(1)).toBe(false)
    })
  })

  describe('isReact18OrLater', async () => {
    vi.mock('react', () => {
      let _version = '0.0.0'

      return {
        get version() {
          return _version
        },
        setVersion(version: string) {
          _version = version
        },
      }
    })

    const react = await import('react')

    it('should return true if React version is 18 or later', async () => {
      // @ts-ignore
      react.setVersion('18.2.0')
      expect(isReact18OrLater()).toBe(true)
      // @ts-ignore
      react.setVersion('18.0.0')
      expect(isReact18OrLater()).toBe(true)
      // @ts-ignore
      react.setVersion('19.0.0')
      expect(isReact18OrLater()).toBe(true)
    })

    it('should return false if React version is less than 18', () => {
      // @ts-ignore
      react.setVersion('17.2.0')
      expect(isReact18OrLater()).toBe(false)
      // @ts-ignore
      react.setVersion('17.0.0')
      expect(isReact18OrLater()).toBe(false)
      // @ts-ignore
      react.setVersion('16.0.0')
      expect(isReact18OrLater()).toBe(false)
    })
  })

  describe('hasOwn', () => {
    it('should return true if object has own property', () => {
      const obj = { key: 'value' }
      expect(hasOwn(obj, 'key')).toBe(true)
    })

    it('should return false if object does not have own property', () => {
      const obj = { key: 'value' }
      expect(hasOwn(obj, 'nonExistentKey')).toBe(false)
    })
  })

  describe('createPromiseWithResolvers', () => {
    it('should create a promise that can be resolved', async () => {
      const { resolve, promise } = createPromiseWithResolvers<string>()
      const result = promise.then((value) => value)
      resolve('resolved value')
      expect(await result).toBe('resolved value')
    })
  })

  describe('increaseWithUnit', () => {
    it('should increase numeric value', () => {
      expect(increaseWithUnit(2, 1)).toBe(3)
    })

    it('should increase string value with unit', () => {
      expect(increaseWithUnit('2px', 1)).toBe('3px')
    })

    it('should handle negative delta', () => {
      expect(increaseWithUnit('15em', -2)).toBe('13em')
    })
  })

  describe('createSingletonPromise', () => {
    it('should return the same promise on subsequent calls', async () => {
      const fn = vi.fn(() => Promise.resolve('value'))
      const singleton = createSingletonPromise(fn)

      const firstCall = singleton()
      const secondCall = singleton()

      expect(firstCall).toBe(secondCall)
      expect(await firstCall).toBe('value')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should reset the promise', async () => {
      const fn = vi.fn(() => Promise.resolve('value'))
      const singleton = createSingletonPromise(fn)

      await singleton()
      await singleton.reset()
      const newCall = singleton()
      expect(await newCall).toBe('value')
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })
})
