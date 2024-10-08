import { renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useLayoutEffectOnce } from './index'

describe('useLayoutEffectOnce', () => {
  it('should defined', () => {
    expect(useLayoutEffectOnce).toBeDefined()
  })

  it('should run effect only once', () => {
    const renderCont = { effect: 0, clear: 0 }

    const result = renderHook(() => {
      useLayoutEffectOnce(() => {
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
