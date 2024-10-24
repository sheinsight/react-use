import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useDropZone } from './index'

describe('useDropZone', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
    div.id = '#target'
    document.body.appendChild(div)
  })

  afterEach(() => {
    div.remove()
  })

  it('should defined', () => {
    expect(useDropZone).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useDropZone('#target'))

    expect(result.current.files).toEqual(null)
    expect(result.current.isOverDropZone).toEqual(false)
  })

  it('should handle drag events', async () => {
    const { result } = renderHook(() => useDropZone('#target'))

    await act(async () => {
      const enterE = new Event('dragenter')
      div.dispatchEvent(enterE)
      const overE = new Event('dragover')
      div.dispatchEvent(overE)
    })

    // expect(result.current.isOverDropZone).toEqual(true)
  })
})
