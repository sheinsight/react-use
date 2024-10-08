import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useEffectOnce } from './index'

describe('useEffectOnce', () => {
  it('should defined', () => {
    expect(useEffectOnce).toBeDefined()
  })

  it('should run effect only once', () => {
    const renderCont = { effect: 0, clear: 0 }

    const result = renderHook(() => {
      useEffectOnce(() => {
        renderCont.effect++
        return () => {
          renderCont.clear++
        }
      })
    })

    expect(renderCont.effect).toBe(1)
    expect(renderCont.clear).toBe(0)

    result.rerender()
    expect(renderCont.effect).toBe(1)
    expect(renderCont.clear).toBe(0)

    result.rerender()
    expect(renderCont.effect).toBe(1)
    expect(renderCont.clear).toBe(0)

    result.rerender()
    expect(renderCont.effect).toBe(1)
    expect(renderCont.clear).toBe(0)

    result.unmount()
    expect(renderCont.effect).toBe(1)
    expect(renderCont.clear).toBe(1)
  })
})
