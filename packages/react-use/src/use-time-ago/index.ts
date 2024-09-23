import { useNow } from '../use-now'
export { formatTimeAgo } from './format-time-ago'
import { normalizeDate } from '../use-date-format'
import { unwrapGettable } from '../utils/unwrap'
import { DEFAULT_MESSAGES, formatTimeAgo } from './format-time-ago'

import type { DateLike } from '../use-date-format'
import type { Pausable } from '../use-pausable'
import type { Gettable } from '../utils/basic'
export type { FormatTimeAgoOptions } from './format-time-ago'
import type { FormatTimeAgoOptions, TimeAgoMessages, TimeAgoUnitNamesDefault } from './format-time-ago'

export type UseTimeAgoReturns<Controls extends boolean = false> = Controls extends true
  ? { timeAgo: string } & Pausable
  : string

export interface UseTimeAgoOptions<Controls extends boolean, UnitNames extends string = TimeAgoUnitNamesDefault>
  extends FormatTimeAgoOptions<UnitNames> {
  /**
   * Expose more controls
   *
   * @defaultValue false
   */
  controls?: Controls
  /**
   * Intervals to update, set 0 to disable auto update
   *
   * @defaultValue 30_000
   */
  updateInterval?: number
}

/**
 * A React Hook that helps to format a date to a human-readable time ago string. It will automatically update the time ago string every 30 seconds by default.
 */
export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options?: UseTimeAgoOptions<false, UnitNames>,
): UseTimeAgoReturns<false>
export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options: UseTimeAgoOptions<true, UnitNames>,
): UseTimeAgoReturns<true>
export function useTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  time: Gettable<DateLike>,
  options: UseTimeAgoOptions<boolean, UnitNames> = {},
) {
  const { controls: exposeControls = false, updateInterval = 30_000 } = options

  const { now, ...controls } = useNow({ interval: updateInterval, controls: true })
  const timeAgo = formatTimeAgo(new Date(normalizeDate(unwrapGettable(time))), options, now)

  return exposeControls ? { timeAgo, ...controls } : timeAgo
}

/**
 * Default messages for Chinese Simplified language
 */
export const CHINESE_MESSAGES: TimeAgoMessages<TimeAgoUnitNamesDefault> = {
  justNow: '刚刚',
  past: (n) => (n.match(/\d/) ? `${n}前` : n),
  future: (n) => (n.match(/\d/) ? `${n}后` : n),
  month: (n, past) => (n === 1 ? (past ? '上个月' : '下个月') : `${n} 个月`),
  year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n} 年`),
  day: (n, past) => (n === 1 ? (past ? '昨天' : '明天') : `${n} 天`),
  week: (n, past) => (n === 1 ? (past ? '上周' : '下周') : `${n} 周`),
  hour: (n) => `${n} 小时`,
  minute: (n) => `${n} 分钟`,
  second: (n) => `${n} 秒`,
  invalid: '',
}

/**
 * Default messages for Chinese Traditional language
 */
export const CHINESE_TRADITIONAL_MESSAGES: TimeAgoMessages<TimeAgoUnitNamesDefault> = {
  justNow: '剛剛',
  past: (n) => (n.match(/\d/) ? `${n}前` : n),
  future: (n) => (n.match(/\d/) ? `${n}後` : n),
  month: (n, past) => (n === 1 ? (past ? '上個月' : '下個月') : `${n} 個月`),
  year: (n, past) => (n === 1 ? (past ? '去年' : '明年') : `${n} 年`),
  day: (n, past) => (n === 1 ? (past ? '昨天' : '明天') : `${n} 天`),
  week: (n, past) => (n === 1 ? (past ? '上週' : '下週') : `${n} 週`),
  hour: (n) => `${n} 小時`,
  minute: (n) => `${n} 分鐘`,
  second: (n) => `${n} 秒`,
  invalid: '',
}

/**
 * Default messages for Japanese language
 */
export const JAPANESE_MESSAGES: TimeAgoMessages<TimeAgoUnitNamesDefault> = {
  justNow: 'たった今',
  past: (n) => (n.match(/\d/) ? `${n}前` : n),
  future: (n) => (n.match(/\d/) ? `${n}後` : n),
  month: (n, past) => (n === 1 ? (past ? '先月' : '来月') : `${n} ヶ月`),
  year: (n, past) => (n === 1 ? (past ? '去年' : '来年') : `${n} 年`),
  day: (n, past) => (n === 1 ? (past ? '昨日' : '明日') : `${n} 日`),
  week: (n, past) => (n === 1 ? (past ? '先週' : '来週') : `${n} 週間`),
  hour: (n) => `${n} 時間`,
  minute: (n) => `${n} 分`,
  second: (n) => `${n} 秒`,
  invalid: '',
}

/**
 * Default messages for English language
 */
export const ENGLISH_MESSAGES: TimeAgoMessages<TimeAgoUnitNamesDefault> = DEFAULT_MESSAGES
