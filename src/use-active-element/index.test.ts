import { renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useActiveElement } from './index'

describe('useActiveElement', () => {
  let shadowHost: HTMLElement
  let input: HTMLInputElement
  let shadowInput: HTMLInputElement
  let shadowRoot: ShadowRoot

  beforeEach(() => {
    shadowHost = document.createElement('div')
    shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    input = document.createElement('input')
    shadowInput = input.cloneNode() as HTMLInputElement
    shadowRoot.appendChild(shadowInput)
    document.body.appendChild(input)
    document.body.appendChild(shadowHost)
  })

  afterEach(() => {
    shadowHost.remove()
    input.remove()
  })

  it('should return body when body is active', () => {
    document.body.focus()
    const { result } = renderHook(() => useActiveElement())
    expect(result.current).toBe(document.body)
  })

  it('should return the active element', () => {
    input.focus()
    const { result } = renderHook(() => useActiveElement())
    expect(result.current).toBe(input)
  })

  it('should return the active element', () => {
    shadowHost.focus()
    shadowInput.focus()
    const { result } = renderHook(() => useActiveElement({ deep: false }))
    expect(result.current).toBe(shadowHost)
  })

  it('should return the active element inside shadow DOM', () => {
    shadowHost.focus()
    shadowInput.focus()
    const { result } = renderHook(() => useActiveElement({ deep: true }))
    expect(result.current).toBe(shadowInput)
  })
})
