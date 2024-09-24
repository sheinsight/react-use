import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClipboard } from './index'

describe('useClipboard', () => {
  const originalClipboard = { ...global.navigator.clipboard }

  const mockClipboard = {
    writeText: vi.fn(),
    readText: vi.fn(),
  }

  beforeEach(() => {
    vi.useFakeTimers()
    Object.assign(navigator, {
      clipboard: mockClipboard,
      permissions: {
        query() {
          return Promise.resolve({
            state: 'granted',
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          })
        },
      },
    })

    document.hasFocus = vi.fn().mockReturnValue(true)
    document.execCommand = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    Object.assign(navigator, { clipboard: originalClipboard })
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    const { result } = renderHook(() => useClipboard())

    expect(result.current.isSupported).toBe(true)
    expect(result.current.text).toBe('')
    expect(result.current.copied).toBe(false)
  })

  it('should copy text to clipboard using Clipboard API', async () => {
    const { result } = renderHook(() => useClipboard())

    // wait for permission update, to use Clipboard API
    await act(async () => {})

    await act(async () => {
      await result.current.copy('Test text')
    })

    expect(mockClipboard.writeText).toHaveBeenCalledWith('Test text')
    expect(result.current.text).toBe('Test text')
    expect(result.current.copied).toBe(true)
  })

  it('should use fallback method when Clipboard API is not supported', async () => {
    Object.assign(navigator, { clipboard: undefined })
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Fallback text')
    })

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result.current.text).toBe('Fallback text')
    expect(result.current.copied).toBe(true)
  })

  it('should reset copied state after specified duration', async () => {
    const { result } = renderHook(() => useClipboard({ copiedDuration: 1000 }))

    await act(async () => {
      await result.current.copy('Reset test')
    })

    expect(result.current.copied).toBe(true)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.copied).toBe(false)
  })

  it('should call onCopy callback when text is copied', async () => {
    const onCopy = vi.fn()
    const { result } = renderHook(() => useClipboard({ onCopy }))

    await act(async () => {
      await result.current.copy('Callback test')
    })

    expect(onCopy).toHaveBeenCalledWith('Callback test')
  })

  it('should call onCopiedReset callback when copied state is reset', async () => {
    const onCopiedReset = vi.fn()
    const { result } = renderHook(() => useClipboard({ onCopiedReset, copiedDuration: 1000 }))

    await act(async () => {
      await result.current.copy('Reset callback test')
    })

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onCopiedReset).toHaveBeenCalled()
  })

  it('should clear clipboard content', async () => {
    const { result } = renderHook(() => useClipboard())

    await act(async () => {
      await result.current.copy('Clear test')
    })

    expect(result.current.text).toBe('Clear test')

    act(() => {
      result.current.clear()
    })

    expect(mockClipboard.writeText).toHaveBeenCalledWith('')
    expect(result.current.text).toBe('')
  })

  it('should use provided source when copying without argument', async () => {
    const { result } = renderHook(() => useClipboard({ source: 'Source text' }))

    // wait for permission update, to use Clipboard API
    await act(async () => {})

    await act(async () => {
      await result.current.copy()
    })

    expect(mockClipboard.writeText).toHaveBeenCalledWith('Source text')
    expect(result.current.text).toBe('Source text')
  })

  it('should read clipboard content when read option is true', async () => {
    mockClipboard.readText.mockResolvedValue('Read test')
    const { result } = renderHook(() => useClipboard({ read: true }))

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
    })

    expect(mockClipboard.readText).toHaveBeenCalled()
    expect(result.current.text).toBe('Read test')
  })

  it('should not read clipboard when document is not focused', async () => {
    document.hasFocus = vi.fn().mockReturnValue(false)
    const { result } = renderHook(() => useClipboard({ read: true }))

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
    })

    expect(mockClipboard.readText).not.toHaveBeenCalled()
    expect(result.current.text).toBe('')
  })
})
