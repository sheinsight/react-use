import { useCreation } from '../use-creation'
import { useLatest } from '../use-latest'

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

/**
 * A dependency-free React Hook to format date using symbols, similar to the `format` function found in libraries.
 *
 * Such as [dayjs#format](https://day.js.org/docs/en/display/format), [momentjs#format](https://momentjs.com/docs/#/displaying/format/), or [date-fns#format](https://date-fns.org/docs/format).
 *
 * By default, the formatting behavior aligns with that of `dayjs`, `momentjs`, and `date-fns@^1`.
 *
 * You can set `unicodeSymbols` option to `true` to use [Unicde Standard Date Symbols](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table), which is similar to `date-fns@^2` and subsequent versions.
 */
export function useDateFormat(
  /**
   * a date object or a date string
   */
  date: DateLike | null | undefined,
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
  const { fallback: fallbackStr = '', unicodeSymbols, locales } = options
  const latest = useLatest({ options })

  const result = useCreation(() => {
    const nDate = normalizeDate(date)
    const isInvalid = Number.isNaN(nDate.getTime())
    return isInvalid ? fallbackStr : formatDate(nDate, formatStr, latest.current.options)
  }, [date, formatStr, fallbackStr, unicodeSymbols, locales])

  return result
}
