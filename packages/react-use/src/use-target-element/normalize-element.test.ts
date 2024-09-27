import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { normalizeElement } from './normalize-element'

describe('normalizeElement', () => {
  let element: HTMLElement | null = null

  beforeEach(() => {
    element = document.createElement('div')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element) {
      document.body.removeChild(element)
      element = null
    }
  })

  it('should return the element when passed a valid HTMLElement', () => {
    const result = normalizeElement(element)
    expect(result).toBe(element)
  })

  it('should return null when passed null', () => {
    const result = normalizeElement(null)
    expect(result).toBeNull()
  })

  it('should return the element when passed a valid selector string', () => {
    const result = normalizeElement('div')
    expect(result).toBe(element)
  })

  it('should return null when passed an invalid selector string', () => {
    const result = normalizeElement('invalid-selector')
    expect(result).toBeNull()
  })

  it('should return the window object when passed window', () => {
    const result = normalizeElement(window)
    expect(result).toBe(window)
  })

  it('should return the document object when passed document', () => {
    const result = normalizeElement(document)
    expect(result).toBe(document)
  })

  it('should handle function input correctly', () => {
    const result = normalizeElement(() => element)
    expect(result).toBe(element)
  })

  it('should return null for undefined input', () => {
    const result = normalizeElement(undefined)
    expect(result).toBeNull()
  })

  it('should return the element when passed a ref object', () => {
    const ref = { current: element }
    const result = normalizeElement(ref)
    expect(result).toBe(element)
  })
})
