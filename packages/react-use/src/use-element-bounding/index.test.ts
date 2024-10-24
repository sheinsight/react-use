import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useElementBounding } from './index'

describe('useElementBounding', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
    div.style.width = '200px'
    div.style.height = '100px'
    document.body.appendChild(div)
  })

  afterEach(() => {
    div.remove()
  })

  it('should defined', () => {
    expect(useElementBounding).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useElementBounding(null))

    expect(result.current[0].x).toBe(0)
    expect(result.current[0].y).toBe(0)
    expect(result.current[0].width).toBe(0)
    expect(result.current[0].height).toBe(0)
    expect(result.current[0].left).toBe(0)
    expect(result.current[0].top).toBe(0)
    expect(result.current[0].right).toBe(0)
    expect(result.current[0].bottom).toBe(0)
    expect(result.current[1]).toBeInstanceOf(Function)
  })

  // for now, jsdom/happy-dom not support `MutationObserver`

  // it('should return bounding value', () => {
  //   const { result } = renderHook(() => useElementBounding(div))

  //   expect(result.current[0].x).toBe(0)
  //   expect(result.current[0].y).toBe(0)
  //   expect(result.current[0].width).toBe(0)
  //   expect(result.current[0].height).toBe(0)
  //   expect(result.current[0].left).toBe(0)
  //   expect(result.current[0].top).toBe(0)
  //   expect(result.current[0].right).toBe(0)
  //   expect(result.current[0].bottom).toBe(0)
  //   expect(result.current[1]).toBeInstanceOf(Function)
  // })
})
