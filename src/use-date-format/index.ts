import { useCreation } from '../use-creation'

import { formatDate, normalizeDate } from './mini-dayjs'
export { formatDate, normalizeDate } from './mini-dayjs'

import type { DateLike, FormatDateOptions } from './mini-dayjs'
export type { DateLike, FormatDateOptions } from './mini-dayjs'

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
   * @default 'HH:mm:ss'
   */
  formatStr = 'HH:mm:ss',
  /**
   * options for formatting
   */
  options: UseDateFormatOptions = {},
): string {
  const { fallback: fallbackStr = '' } = options

  const result = useCreation(() => {
    const nDate = date ? normalizeDate(date) : null
    return nDate ? formatDate(normalizeDate(nDate), formatStr, options) : fallbackStr
  }, [date, formatStr, fallbackStr])

  return result
}
