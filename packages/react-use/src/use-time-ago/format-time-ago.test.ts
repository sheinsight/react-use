import { beforeEach, describe, expect, it } from 'vitest'
import { CHINESE_MESSAGES } from '.'
import { formatTimeAgo } from './format-time-ago'

describe('formatTimeAgo', () => {
  let now: Date

  beforeEach(() => {
    now = new Date()
  })

  it('should return "just now" for times less than a minute ago', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 30000))
    expect(result).toBe('just now')
  })

  it('should return correct past time for seconds', () => {
    const result = formatTimeAgo(new Date(now.getTime() - 45000))
    expect(result).toBe('just now')
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
