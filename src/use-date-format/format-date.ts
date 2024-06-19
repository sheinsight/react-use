// mainly from https://github.com/vueuse/vueuse/blob/main/packages/shared/useDateFormat/index.ts

import { isString } from '../utils/basic'

const REGEX = /* #__PURE__ */ {
  parse: /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
  conventionSymbol:
    /[YMDHhms]o|\[([^\]]+)\]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|S{1,3}/g,
  unicodeSymbol: /\[([^\]]+)]|y{2,4}|M{1,4}|d{1,2}|e{3,5}|H{1,2}|h{1,2}|a{4}|m{1,2}|s{1,2}|S{1,3}/g,
} as const

export const defaultMeridiem = (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => {
  let m = hours < 12 ? 'AM' : 'PM'
  if (hasPeriod) m = m.split('').reduce((acc, curr) => `${acc}${curr}.`, '')
  return isLowercase ? m.toLowerCase() : m
}

export const formatOrdinal = (num: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = num % 100
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

export type FormatDateOptions = {
  /**
   * Whether to use Unicode date symbols.
   *
   * @see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   *
   * @default false
   */
  unicodeSymbols?: boolean
  /**
   * The locales argument indicates the locale to use.
   */
  locales?: Intl.LocalesArgument
  /**
   * A custom function to format the meridiem.
   */
  customMeridiem?: (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => string
}

export const formatDate = (date: Date, formatStr: string, options: FormatDateOptions = {}) => {
  const years = date.getFullYear()
  const month = date.getMonth()
  const days = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()
  const day = date.getDay()
  const meridiem = options.customMeridiem ?? defaultMeridiem

  const matches: {
    conventionSymbol: Record<string, () => string | number>
    unicodeSymbol: Record<string, () => string | number>
  } = {
    conventionSymbol: {
      Yo: () => formatOrdinal(years),
      YY: () => String(years).slice(-2),
      YYYY: () => years,
      M: () => month + 1,
      Mo: () => formatOrdinal(month + 1),
      MM: () => `${month + 1}`.padStart(2, '0'),
      MMM: () => date.toLocaleDateString(options.locales, { month: 'short' }),
      MMMM: () => date.toLocaleDateString(options.locales, { month: 'long' }),
      D: () => String(days),
      Do: () => formatOrdinal(days),
      DD: () => `${days}`.padStart(2, '0'),
      H: () => String(hours),
      Ho: () => formatOrdinal(hours),
      HH: () => `${hours}`.padStart(2, '0'),
      h: () => `${hours % 12 || 12}`.padStart(1, '0'),
      ho: () => formatOrdinal(hours % 12 || 12),
      hh: () => `${hours % 12 || 12}`.padStart(2, '0'),
      m: () => String(minutes),
      mo: () => formatOrdinal(minutes),
      mm: () => `${minutes}`.padStart(2, '0'),
      s: () => String(seconds),
      so: () => formatOrdinal(seconds),
      ss: () => `${seconds}`.padStart(2, '0'),
      S: () => `${milliseconds}`.padStart(3, '0').slice(0, 1),
      SS: () => `${milliseconds}`.padStart(3, '0').slice(0, 2),
      SSS: () => `${milliseconds}`.padStart(3, '0'),
      d: () => day,
      dd: () => date.toLocaleDateString(options.locales, { weekday: 'narrow' }),
      ddd: () => date.toLocaleDateString(options.locales, { weekday: 'short' }),
      dddd: () => date.toLocaleDateString(options.locales, { weekday: 'long' }),
      A: () => meridiem(hours, minutes),
      AA: () => meridiem(hours, minutes, false, true),
      a: () => meridiem(hours, minutes, true),
      aa: () => meridiem(hours, minutes, true, true),
    },

    unicodeSymbol: {
      yy: () => String(years).slice(-2),
      yyyy: () => years,
      M: () => month + 1,
      MM: () => `${month + 1}`.padStart(2, '0'),
      MMM: () => date.toLocaleDateString(options.locales, { month: 'short' }),
      MMMM: () => date.toLocaleDateString(options.locales, { month: 'long' }),
      d: () => String(days),
      dd: () => `${days}`.padStart(2, '0'),
      H: () => String(hours),
      HH: () => `${hours}`.padStart(2, '0'),
      h: () => `${hours % 12 || 12}`,
      hh: () => `${hours % 12 || 12}`.padStart(2, '0'),
      m: () => String(minutes),
      mm: () => `${minutes}`.padStart(2, '0'),
      s: () => String(seconds),
      ss: () => `${seconds}`.padStart(2, '0'),
      S: () => `${milliseconds}`.padStart(3, '0').slice(0, 1),
      SS: () => `${milliseconds}`.padStart(3, '0').slice(0, 2),
      SSS: () => `${milliseconds}`.padStart(3, '0'),
      eeeee: () => date.toLocaleDateString(options.locales, { weekday: 'narrow' }),
      eee: () => date.toLocaleDateString(options.locales, { weekday: 'short' }),
      eeee: () => date.toLocaleDateString(options.locales, { weekday: 'long' }),
      aaaa: () => meridiem(hours, minutes, true, false),
    },
  }

  const isUnicodeSymbol = options.unicodeSymbols === true

  function formatDateBySymbolType(formatStr: string, symbol: 'unicodeSymbol' | 'conventionSymbol') {
    return formatStr.replace(REGEX[symbol], (match, $1) => $1 ?? matches[symbol][match]?.() ?? match)
  }

  return formatDateBySymbolType(formatStr, isUnicodeSymbol ? 'unicodeSymbol' : 'conventionSymbol')
}

export type DateLike = Date | number | string

export function normalizeDate(date: DateLike) {
  if (date === null) return new Date(Number.NaN) // null is invalid
  if (date === undefined) return new Date()
  if (date instanceof Date) return new Date(date)

  if (isString(date) && !/Z$/i.test(date)) {
    const d = date.match(REGEX.parse)

    if (d) {
      const m = +d[2] - 1 || 0
      const ms = (d[7] || '0').substring(0, 3)
      return new Date(+d[1], m, +d[3] || 1, +d[4] || 0, +d[5] || 0, +d[6] || 0, +ms)
    }
  }

  return new Date(date)
}
