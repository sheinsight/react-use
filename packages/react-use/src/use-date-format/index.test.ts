import { renderHook } from '@/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDateFormat } from '../index'

describe('useDateFormat', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-04-15T12:34:56'))
  })

  it('should format date with default format', () => {
    const { result } = renderHook(() => useDateFormat(new Date()))
    expect(result.current).toBe('2023-04-15 12:34:56')
  })

  it('should format date with custom format', () => {
    const { result } = renderHook(() => useDateFormat(new Date(), 'YYYY/MM/DD HH:mm'))
    expect(result.current).toBe('2023/04/15 12:34')
  })

  it('should handle null date', () => {
    const { result } = renderHook(() => useDateFormat(null))
    expect(result.current).toBe('')
  })

  it('should handle undefined date', () => {
    const { result } = renderHook(() => useDateFormat(undefined))
    expect(result.current).toBe('2023-04-15 12:34:56')
  })

  it('should format date string', () => {
    const { result } = renderHook(() => useDateFormat('2023-01-01T00:00:00'))
    expect(result.current).toBe('2023-01-01 00:00:00')
  })

  it('should format timestamp', () => {
    const { result } = renderHook(() => useDateFormat(1672531200000, 'M/D/YYYY, H:mm:ss'))
    const expectedDate = new Date(1672531200000).toLocaleString('en-US').slice(0, 17)
    expect(result.current).toBe(expectedDate)
  })

  it('should use fallback for invalid date', () => {
    const { result } = renderHook(() => useDateFormat('invalid date', undefined, { fallback: 'Invalid' }))
    expect(result.current).toBe('Invalid')
  })

  it('should format with unicode symbols', () => {
    const { result } = renderHook(() => useDateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss', { unicodeSymbols: true }))
    expect(result.current).toBe('2023-04-15 12:34:56')
  })

  it('should format with custom locale', () => {
    const { result } = renderHook(() => useDateFormat(new Date(), 'MMMM D, YYYY', { locales: 'fr-FR' }))
    expect(result.current).toBe('avril 15, 2023')
  })

  it('should format ordinal numbers', () => {
    const { result } = renderHook(() => useDateFormat(new Date(), 'Do MMMM YYYY', { locales: 'en-US' }))
    expect(result.current).toBe('15th April 2023')
  })

  it('should format meridiem', () => {
    const { result: amResult } = renderHook(() => useDateFormat(new Date('2023-04-15T09:00:00'), 'hh:mm A'))
    expect(amResult.current).toBe('09:00 AM')

    const { result: pmResult } = renderHook(() => useDateFormat(new Date('2023-04-15T15:00:00'), 'hh:mm a'))
    expect(pmResult.current).toBe('03:00 pm')
  })

  it('should format weekdays', () => {
    const { result } = renderHook(() => useDateFormat(new Date(), 'dddd, ddd, dd', { locales: 'en-US' }))
    expect(result.current).toBe('Saturday, Sat, S')
  })

  it('should format with custom meridiem function', () => {
    const customMeridiem = (hours: number) => (hours < 12 ? 'Morning' : 'Afternoon')
    const { result } = renderHook(() => useDateFormat(new Date(), 'hh:mm A', { customMeridiem }))
    expect(result.current).toBe('12:34 Afternoon')
  })

  it('should update when date changes', () => {
    const { result, rerender } = renderHook(({ date }) => useDateFormat(date), {
      initialProps: { date: new Date('2023-04-15T12:34:56') },
    })
    expect(result.current).toBe('2023-04-15 12:34:56')

    rerender({ date: new Date('2024-01-01T00:00:00') })
    expect(result.current).toBe('2024-01-01 00:00:00')
  })

  it('should update when format changes', () => {
    const { result, rerender } = renderHook(({ format }) => useDateFormat(new Date(), format), {
      initialProps: { format: 'YYYY-MM-DD' },
    })
    expect(result.current).toBe('2023-04-15')

    rerender({ format: 'HH:mm:ss' })
    expect(result.current).toBe('12:34:56')
  })
})
