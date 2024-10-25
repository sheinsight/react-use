import { act, renderHook } from '@/test'
import { describe, expect, it } from 'vitest'
import { useFavicon } from './index'

describe('useFavicon', () => {
  it('should defined', () => {
    expect(useFavicon).toBeDefined()
  })

  it('should return initial value', () => {
    const { result } = renderHook(() => useFavicon('https://example.com/favicon.ico'))
    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    expect(result.current.href).toBe('https://example.com/favicon.ico')
    expect(faviconTag).toBeInstanceOf(HTMLLinkElement)
    expect(faviconTag?.href).toBe('https://example.com/favicon.ico')

    faviconTag?.remove()
  })

  it('should update favicon', () => {
    const { result, rerender } = renderHook((props) => useFavicon(props), {
      initialProps: 'https://example.com/favicon.ico',
    })
    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    expect(result.current.href).toBe('https://example.com/favicon.ico')
    expect(faviconTag).toBeInstanceOf(HTMLLinkElement)
    expect(faviconTag?.href).toBe('https://example.com/favicon.ico')

    rerender('https://example.com/favicon2.ico')

    expect(result.current.href).toBe('https://example.com/favicon2.ico')
    expect(faviconTag).toBeInstanceOf(HTMLLinkElement)
    expect(faviconTag?.href).toBe('https://example.com/favicon2.ico')

    faviconTag?.remove()
  })

  it('should remove favicon', () => {
    const { result, unmount } = renderHook(() =>
      useFavicon('https://example.com/favicon.ico', { restoreOnUnmount: true }),
    )

    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    expect(result.current.href).toBe('https://example.com/favicon.ico')
    expect(faviconTag).toBeInstanceOf(HTMLLinkElement)
    expect(faviconTag?.href).toBe('https://example.com/favicon.ico')

    unmount()
  })

  it('should set emoji favicon', () => {
    const { result } = renderHook(() => useFavicon('https://example.com/favicon.ico'))

    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    act(() => {
      result.current.setEmojiFavicon('🚀')
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(
      `"data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="1em" font-size="90">%F0%9F%9A%80</text></svg>"`,
    )

    faviconTag?.remove()
  })

  it('should handle sync favicon', () => {
    const { result, unmount } = renderHook(() =>
      useFavicon('https://example.com/favicon.ico', { restoreOnUnmount: true }),
    )

    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    act(() => {
      result.current.setEmojiFavicon('🚀')
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(
      `"data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="1em" font-size="90">%F0%9F%9A%80</text></svg>"`,
    )

    faviconTag.setAttribute('href', 'https://example.com/favicon.ico')

    act(() => {
      result.current.syncFavicon()
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(`"https://example.com/favicon.ico"`)

    faviconTag.setAttribute('href', 'https://example.com/favicon2.ico')

    act(() => {
      result.current.syncFavicon(true)
      result.current.setFavicon('https://example.com/favicon3.ico')
    })

    unmount()

    expect(faviconTag?.href).toMatchInlineSnapshot(`"https://example.com/favicon2.ico"`)

    faviconTag?.remove()
  })

  it('should handle setPreviousFavicon', () => {
    const { result, unmount } = renderHook(() =>
      useFavicon('https://example.com/favicon.ico', { restoreOnUnmount: true }),
    )

    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement

    act(() => {
      result.current.setPreviousFavicon() // no previous favicon, nothing should happen
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(`"https://example.com/favicon.ico"`)

    act(() => {
      result.current.setEmojiFavicon('🚀')
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(
      `"data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="1em" font-size="90">%F0%9F%9A%80</text></svg>"`,
    )

    act(() => {
      result.current.setPreviousFavicon()
    })

    expect(faviconTag?.href).toMatchInlineSnapshot(`"https://example.com/favicon.ico"`)

    unmount()
  })

  it('should handle syncOnMount', () => {
    const { result } = renderHook(() => useFavicon(null, { syncOnMount: false }))

    const faviconTag = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    faviconTag.setAttribute('href', 'https://example.com/favicon.ico')

    expect(result.current.href).toBe(null)

    faviconTag?.remove()
  })

  it('should handle syncOnMount with true', () => {
    const faviconTag = document.createElement('link')
    faviconTag.rel = 'icon'
    faviconTag.setAttribute('href', 'https://example.com/favicon.ico')
    document.head.appendChild(faviconTag)

    const { result } = renderHook(() => useFavicon(null))

    expect(result.current.href).toMatchInlineSnapshot(`"https://example.com/favicon.ico"`)

    faviconTag?.remove()
  })
})
