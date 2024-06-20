import { useCreation } from '../use-creation'

import { formatDate, normalizeDate } from './format-date'
export { formatDate, normalizeDate } from './format-date'

import type { DateLike, FormatDateOptions } from './format-date'
export type { DateLike, FormatDateOptions } from './format-date'

export interface UseDateFormatOptions extends FormatDateOptions {
  /**
   * fallback string when date is invalid
   */
  fallback?: string
}

export function useDateFormat(
  /**
   * a date object or a date string
   */
  date: DateLike,
  /**
   * format string
   *
   * @defaultValue 'YYYY-MM-DD HH:mm:ss'
   */
  formatStr = 'YYYY-MM-DD HH:mm:ss',
  /**
   * options for formatting
   */
  options: UseDateFormatOptions = {},
): string {
  const { fallback: fallbackStr = '' } = options

  const result = useCreation(() => {
    const nDate = normalizeDate(date)
    const isInvalid = Number.isNaN(nDate.getTime())
    return isInvalid ? fallbackStr : formatDate(nDate, formatStr, options)
  }, [date, formatStr, fallbackStr, options])

  return result
}
