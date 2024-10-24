import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useVirtualList } from './index'

describe('useVirtualList', () => {
  let containerDiv: HTMLDivElement
  let wrapperDiv: HTMLDivElement

  beforeEach(() => {
    containerDiv = document.createElement('div')
    containerDiv.setAttribute('id', 'container')
    document.body.appendChild(containerDiv)

    wrapperDiv = document.createElement('div')
    wrapperDiv.setAttribute('id', 'wrapper')
    containerDiv.appendChild(wrapperDiv)
  })

  afterEach(() => {
    containerDiv.remove()
    wrapperDiv.remove()
  })

  it('should defined', () => {
    expect(useVirtualList).toBeDefined()
  })

  it('should return initial value', async () => {
    const { result } = renderHook(() =>
      useVirtualList(['1', '2'], {
        itemHeight: 20,
        containerTarget: '#not-exist',
        wrapperTarget: '#not-exist',
      }),
    )
    expect(result.current[1].scrollTo).toBeInstanceOf(Function)
    expect(result.current[1].scrollToStart).toBeInstanceOf(Function)
    expect(result.current[1].scrollToEnd).toBeInstanceOf(Function)
  })
})
