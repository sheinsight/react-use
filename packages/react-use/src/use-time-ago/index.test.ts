import { act, renderHook } from '@/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_MESSAGES } from './format-time-ago'
import {
  CHINESE_MESSAGES,
  CHINESE_TRADITIONAL_MESSAGES,
  ENGLISH_MESSAGES,
  JAPANESE_MESSAGES,
  useTimeAgo,
} from './index'

describe('useTimeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should export the default messages', () => {
    expect(DEFAULT_MESSAGES).toBeDefined()
  })

  it('should set DEFAULT_MESSAGES as the default messages', () => {
    expect(DEFAULT_MESSAGES).toBe(ENGLISH_MESSAGES)
  })

  it('should export the correct DEFAULT messages', () => {
    expect(DEFAULT_MESSAGES).toBeDefined()

    expect(DEFAULT_MESSAGES.invalid).toBe('')
    expect(DEFAULT_MESSAGES.justNow).toBe('just now')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.future('1 day')).toBe('in 1 day')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.past('1 day')).toBe('1 day ago')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.day(1, true)).toBe('yesterday')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.day(1, false)).toBe('tomorrow')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.day(2, true)).toBe('2 days')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.hour(1)).toBe('1 hour')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.minute(1)).toBe('1 minute')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.month(1, true)).toBe('last month')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.month(1, false)).toBe('next month')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.month(2, true)).toBe('2 months')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.second(1)).toBe('1 second')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(1, true)).toBe('last week')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(1, false)).toBe('next week')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(2, true)).toBe('2 weeks')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(1, true)).toBe('last year')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(1, false)).toBe('next year')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(2, true)).toBe('2 years')
  })

  it('should export the correct English messages', () => {
    expect(ENGLISH_MESSAGES).toBeDefined()

    expect(ENGLISH_MESSAGES.invalid).toBe('')
    expect(ENGLISH_MESSAGES.justNow).toBe('just now')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.future('1 day')).toBe('in 1 day')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.past('1 day')).toBe('1 day ago')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.day(1, true)).toBe('yesterday')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.day(1, false)).toBe('tomorrow')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.day(2, true)).toBe('2 days')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.hour(1)).toBe('1 hour')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.minute(1)).toBe('1 minute')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.month(1, true)).toBe('last month')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.month(1, false)).toBe('next month')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.month(2, true)).toBe('2 months')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.second(1)).toBe('1 second')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.week(1, true)).toBe('last week')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.week(1, false)).toBe('next week')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.week(2, true)).toBe('2 weeks')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.year(1, true)).toBe('last year')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.year(1, false)).toBe('next year')
    // @ts-expect-error for test
    expect(ENGLISH_MESSAGES.year(2, true)).toBe('2 years')
  })

  it('should export the correct Chinese messages', () => {
    expect(CHINESE_MESSAGES).toBeDefined()

    expect(CHINESE_MESSAGES.invalid).toBe('')
    expect(CHINESE_MESSAGES.justNow).toBe('刚刚')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.future('1 天')).toBe('1 天后')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.future('下个月')).toBe('下个月')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.past('1 天')).toBe('1 天前')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.past('上个礼拜')).toBe('上个礼拜')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.day(1, true)).toBe('昨天')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.day(1, false)).toBe('明天')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.day(2, true)).toBe('2 天')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.hour(1)).toBe('1 小时')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.minute(1)).toBe('1 分钟')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.month(1, true)).toBe('上个月')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.month(1, false)).toBe('下个月')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.month(2, true)).toBe('2 个月')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.second(1)).toBe('1 秒')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.week(1, true)).toBe('上周')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.week(1, false)).toBe('下周')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.week(2, true)).toBe('2 周')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.year(1, true)).toBe('去年')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.year(1, false)).toBe('明年')
    // @ts-expect-error for test
    expect(CHINESE_MESSAGES.year(2, true)).toBe('2 年')
  })

  it('should export the correct Chinese Tradition messages', () => {
    expect(CHINESE_TRADITIONAL_MESSAGES).toBeDefined()

    expect(CHINESE_TRADITIONAL_MESSAGES.invalid).toBe('')
    expect(CHINESE_TRADITIONAL_MESSAGES.justNow).toBe('剛剛')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.future('1 天')).toBe('1 天後')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.future('下個月')).toBe('下個月')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.past('1 天')).toBe('1 天前')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.past('上個月')).toBe('上個月')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.day(1, true)).toBe('昨天')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.day(1, false)).toBe('明天')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.day(2, true)).toBe('2 天')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.hour(1)).toBe('1 小時')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.minute(1)).toBe('1 分鐘')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.month(1, true)).toBe('上個月')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.month(1, false)).toBe('下個月')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.month(2, true)).toBe('2 個月')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.second(1)).toBe('1 秒')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.week(1, true)).toBe('上週')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.week(1, false)).toBe('下週')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.week(2, true)).toBe('2 週')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.year(1, true)).toBe('去年')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.year(1, false)).toBe('明年')
    // @ts-expect-error for test
    expect(CHINESE_TRADITIONAL_MESSAGES.year(2, true)).toBe('2 年')
  })

  it('should export the correct Japanese messages', () => {
    expect(JAPANESE_MESSAGES).toBeDefined()

    expect(JAPANESE_MESSAGES.invalid).toBe('')
    expect(JAPANESE_MESSAGES.justNow).toBe('たった今')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.future('1 日')).toBe('1 日後')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.future('两日後')).toBe('两日後')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.past('1 日')).toBe('1 日前')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.past('两日')).toBe('两日')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.day(1, true)).toBe('昨日')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.day(1, false)).toBe('明日')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.day(2, true)).toBe('2 日')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.hour(1)).toBe('1 時間')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.minute(1)).toBe('1 分')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.month(1, true)).toBe('先月')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.month(1, false)).toBe('来月')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.month(2, true)).toBe('2 ヶ月')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.second(1)).toBe('1 秒')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.week(1, true)).toBe('先週')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.week(1, false)).toBe('来週')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.week(2, true)).toBe('2 週間')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.year(1, true)).toBe('去年')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.year(1, false)).toBe('来年')
    // @ts-expect-error for test
    expect(JAPANESE_MESSAGES.year(2, true)).toBe('2 年')
  })

  it('should return "just now" for a recent date', () => {
    const { result } = renderHook(() => useTimeAgo(new Date()))
    expect(result.current).toBe(ENGLISH_MESSAGES.justNow)
  })

  it('should update the time ago string after the update interval', () => {
    const { result } = renderHook(() => useTimeAgo(new Date(Date.now() - 1000 * 60)))
    expect(result.current).toBe('1 minute ago')

    act(() => {
      vi.advanceTimersByTime(30_000)
    })

    expect(result.current).toBe('1 minute ago')
  })

  it('should return the correct time ago string for past dates', () => {
    const { result } = renderHook(() => useTimeAgo(new Date(Date.now() - 1000 * 60 * 60)))
    expect(result.current).toBe('1 hour ago')
  })

  it('should return the correct time ago string for future dates', () => {
    const { result } = renderHook(() => useTimeAgo(new Date(Date.now() + 1000 * 60 * 60)))
    expect(result.current).toBe('in 1 hour')
  })

  it('should expose controls when controls option is true', () => {
    const { result } = renderHook(() => useTimeAgo(new Date(), { controls: true }))
    expect(result.current).toHaveProperty('pause')
    expect(result.current).toHaveProperty('resume')
    expect(result.current.timeAgo).toBe(ENGLISH_MESSAGES.justNow)
  })

  it('should not update the time ago string when paused', () => {
    const { result } = renderHook(() => useTimeAgo(new Date(Date.now() - 1000 * 60), { controls: true }))
    expect(result.current.timeAgo).toBe('1 minute ago')

    act(() => {
      result.current.pause()
      vi.advanceTimersByTime(30_000)
    })

    expect(result.current.timeAgo).toBe('1 minute ago')
  })

  it('should resume updating the time ago string when resumed', async () => {
    const time = new Date(Date.now() - 1000 * 60)
    const { result } = renderHook(() =>
      useTimeAgo(time, {
        controls: true,
        updateInterval: 1_000,
      }),
    )
    expect(result.current.timeAgo).toBe('1 minute ago')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(result.current.timeAgo).toBe('2 minutes ago')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(12 * 60_000)
    })

    expect(result.current.timeAgo).toBe('14 minutes ago')

    await act(async () => {
      result.current.pause()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(result.current.timeAgo).toBe('14 minutes ago')

    await act(async () => {
      result.current.resume()
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(result.current.timeAgo).toBe('16 minutes ago')
  })
})
