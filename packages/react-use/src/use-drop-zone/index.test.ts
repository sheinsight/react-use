import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDropZone } from './index'

describe('useDropZone', () => {
  let div: HTMLDivElement

  beforeEach(() => {
    div = document.createElement('div')
    div.setAttribute('id', 'target')
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

    expect(result.current.isOverDropZone).toEqual(false)

    await act(async () => {
      const enterE = new Event('dragenter')
      div.dispatchEvent(enterE)
      const overE = new Event('dragover')
      div.dispatchEvent(overE)
    })

    expect(result.current.isOverDropZone).toEqual(true)

    await act(async () => {
      const leaveE = new Event('dragleave')
      div.dispatchEvent(leaveE)
    })

    expect(result.current.isOverDropZone).toEqual(false)
  })

  it('should handle drop event', async () => {
    const { result } = renderHook(() => useDropZone('#target'))

    expect(result.current.files).toEqual(null)

    await act(async () => {
      const dropE = new Event('drop')
      // @ts-ignore for testing
      dropE.dataTransfer = {
        files: [{ name: 'file1' }, { name: 'file2' }],
        items: [{ kind: 'file', type: 'image/png' }],
      }
      div.dispatchEvent(dropE)
    })

    expect(result.current.files).toEqual([{ name: 'file1' }, { name: 'file2' }])
  })

  it('should handle dataTypes', async () => {
    const { result } = renderHook(() =>
      useDropZone('#target', {
        dataTypes: ['text/plain'],
      }),
    )

    expect(result.current.files).toEqual(null)

    await act(async () => {
      const enterE = new Event('dragenter')
      // @ts-ignore for testing
      enterE.dataTransfer = {
        files: [{ name: 'file1' }, { name: 'file2' }],
        items: [{ kind: 'file', type: 'image/png' }],
      }
      div.dispatchEvent(enterE)

      const overE = new Event('dragover')
      div.dispatchEvent(overE)

      const dropE = new Event('drop')
      div.dispatchEvent(dropE)
    })

    expect(result.current.files).toEqual(null)
  })

  it('should handle onDrop callback', async () => {
    const onDrop = vi.fn()
    const { result } = renderHook(() => useDropZone('#target', { onDrop }))

    expect(result.current.files).toEqual(null)
    expect(onDrop).toHaveBeenCalledTimes(0)

    await act(async () => {
      const dropE = new Event('drop')
      // @ts-ignore for testing
      dropE.dataTransfer = {
        files: [{ name: 'file1' }, { name: 'file2' }],
        items: [{ kind: 'file', type: 'image/png' }],
      }
      div.dispatchEvent(dropE)
    })

    expect(result.current.files).toEqual([{ name: 'file1' }, { name: 'file2' }])
    expect(onDrop).toHaveBeenCalledTimes(1)
    expect(onDrop).toHaveBeenCalledWith([{ name: 'file1' }, { name: 'file2' }], expect.any(Event))
  })

  it('should handle onDrop callback as second argument', async () => {
    const onDrop = vi.fn()
    const { result } = renderHook(() => useDropZone('#target', onDrop))

    expect(result.current.files).toEqual(null)
    expect(onDrop).toHaveBeenCalledTimes(0)

    await act(async () => {
      const dropE = new Event('drop')
      // @ts-ignore for testing
      dropE.dataTransfer = {
        files: [{ name: 'file1' }, { name: 'file2' }],
        items: [{ kind: 'file', type: 'image/png' }],
      }
      div.dispatchEvent(dropE)
    })

    expect(result.current.files).toEqual([{ name: 'file1' }, { name: 'file2' }])
    expect(onDrop).toHaveBeenCalledTimes(1)
    expect(onDrop).toHaveBeenCalledWith([{ name: 'file1' }, { name: 'file2' }], expect.any(Event))
  })

  it('should handle dataTypes as function', async () => {
    const { result } = renderHook(() =>
      useDropZone('#target', {
        dataTypes: (types) => types.includes('text/plain'),
      }),
    )

    expect(result.current.files).toEqual(null)

    await act(async () => {
      const enterE = new Event('dragenter')
      // @ts-ignore for testing
      enterE.dataTransfer = {
        files: [{ name: 'file1' }, { name: 'file2' }],
        items: [
          { kind: 'file', type: 'image/png' },
          { kind: 'other', type: 'xxx/xxx' },
        ],
      }
      div.dispatchEvent(enterE)

      const overE = new Event('dragover')
      div.dispatchEvent(overE)

      const dropE = new Event('drop')
      div.dispatchEvent(dropE)
    })

    expect(result.current.files).toEqual(null)
  })

  it('should handle onEnter callback', async () => {
    const onEnter = vi.fn()
    const { result } = renderHook(() => useDropZone('#target', { onEnter }))

    expect(onEnter).toHaveBeenCalledTimes(0)

    await act(async () => {
      const enterE = new Event('dragenter')
      div.dispatchEvent(enterE)
    })

    expect(onEnter).toHaveBeenCalledTimes(1)
  })

  it('should handle onOver callback', async () => {
    const onOver = vi.fn()
    const { result } = renderHook(() => useDropZone('#target', { onOver }))

    expect(onOver).toHaveBeenCalledTimes(0)

    await act(async () => {
      const overE = new Event('dragover')
      div.dispatchEvent(overE)
    })

    expect(onOver).toHaveBeenCalledTimes(1)
  })

  it('should handle onLeave callback', async () => {
    const onLeave = vi.fn()
    const { result } = renderHook(() => useDropZone('#target', { onLeave }))

    expect(onLeave).toHaveBeenCalledTimes(0)

    await act(async () => {
      const leaveE = new Event('dragleave')
      div.dispatchEvent(leaveE)
    })

    expect(onLeave).toHaveBeenCalledTimes(1)
  })
})
