import { beforeEach, describe, expect, it } from 'vitest'
import { CHINESE_MESSAGES } from '.'
import { DEFAULT_MESSAGES, formatTimeAgo } from './format-time-ago'

describe('formatTimeAgo', () => {
  let now: Date

  beforeEach(() => {
    now = new Date()
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
    expect(DEFAULT_MESSAGES.day(2, false)).toBe('2 days')
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
    expect(DEFAULT_MESSAGES.month(2, false)).toBe('2 months')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.second(1)).toBe('1 second')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(1, true)).toBe('last week')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(1, false)).toBe('next week')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(2, true)).toBe('2 weeks')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.week(2, false)).toBe('2 weeks')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(1, true)).toBe('last year')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(1, false)).toBe('next year')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(2, true)).toBe('2 years')
    // @ts-expect-error for test
    expect(DEFAULT_MESSAGES.year(2, false)).toBe('2 years')
  })

  it('should return "just now" for times less than a minute ago', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 30000))
    expect(result).toBe('just now')
  })

  it('should return correct past time for seconds', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 45000))
    expect(result).toBe('just now')
  })

  it('should handle invalid dates', () => {
    const result = formatTimeAgo(new Date('invalid'))
    expect(result).toBe('')
  })

  it('should handle custom invalid message', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 65_321), {
      messages: { ...CHINESE_MESSAGES, minute: '{0}-分钟' } as typeof CHINESE_MESSAGES,
    })
    expect(result).toBe('1-分钟前')
  })

  it('should handle rounding', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 65_000), { rounding: 1 })
    expect(result).toBe('1.1 minutes ago')
  })

  it('should handle showSecond', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 37_000), { showSecond: true })
    expect(result).toBe('37 seconds ago')
  })

  it('should return correct past time for minutes', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 120000))
    expect(result).toBe('2 minutes ago')
  })

  it('should return correct past time for hours', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 3600000))
    expect(result).toBe('1 hour ago')
  })

  it('should return correct past time for days', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 86400000))
    expect(result).toBe('yesterday')
  })

  it('should return correct future time', () => {
    const result = formatTimeAgo(new Date(now.getTime() + 3600000))
    expect(result).toBe('in 1 hour')
  })

  it('should return full date for times exceeding max', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 31536000000), { max: 'year' })
    expect(result).toMatch('last year')
  })

  it('should handle custom messages', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 60000), { messages: CHINESE_MESSAGES })
    expect(result).toBe('1 分钟前')
  })
})
