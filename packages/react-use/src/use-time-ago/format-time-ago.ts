import { isFunction, isNumber } from '../utils/basic'

export type TimeAgoFormatter<T = number> = (value: T, isPast: boolean) => string
export type TimeAgoUnitNamesDefault = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
export type TimeAgeFullDateFormatter = (date: Date) => string
export type TimeAgoMessagesBuiltIn = {
  justNow: string
  past: string | TimeAgoFormatter<string>
  future: string | TimeAgoFormatter<string>
  invalid: string
}

export type TimeAgoMessages<UnitNames extends string = TimeAgoUnitNamesDefault> = TimeAgoMessagesBuiltIn &
  Record<UnitNames, string | TimeAgoFormatter<number>>

export type FormatTimeAgoOptions<UnitNames extends string = TimeAgoUnitNamesDefault> = {
  /**
   * Maximum unit (of diff in milliseconds) to display the full date instead of relative
   *
   * @defaultValue undefined
   */
  max?: UnitNames | number
  /**
   * Formatter for full date
   */
  fullDateFormatter?: TimeAgeFullDateFormatter
  /**
   * Messages for formatting the string
   */
  messages?: TimeAgoMessages<UnitNames>
  /**
   * Minimum display time unit (default is minute)
   *
   * @defaultValue false
   */
  showSecond?: boolean
  /**
   * Rounding method to apply.
   *
   * @defaultValue 'round'
   */
  rounding?: 'round' | 'ceil' | 'floor' | number
  /**
   * Custom units
   */
  units?: TimeAgoUnit<UnitNames>[]
}

export type TimeAgoUnit<Unit extends string = TimeAgoUnitNamesDefault> = {
  max: number
  value: number
  name: Unit
}

const DEFAULT_UNITS: TimeAgoUnit<TimeAgoUnitNamesDefault>[] = [
  { max: 60000, value: 1000, name: 'second' },
  { max: 2760000, value: 60000, name: 'minute' },
  { max: 72000000, value: 3600000, name: 'hour' },
  { max: 518400000, value: 86400000, name: 'day' },
  { max: 2419200000, value: 604800000, name: 'week' },
  { max: 28512000000, value: 2592000000, name: 'month' },
  { max: Number.POSITIVE_INFINITY, value: 31536000000, name: 'year' },
]

const DEFAULT_MESSAGES: TimeAgoMessages<TimeAgoUnitNamesDefault> = {
  justNow: 'just now',
  past: (n) => (n.match(/\d/) ? `${n} ago` : n),
  future: (n) => (n.match(/\d/) ? `in ${n}` : n),
  month: (n, past) => (n === 1 ? (past ? 'last month' : 'next month') : `${n} month${n > 1 ? 's' : ''}`),
  year: (n, past) => (n === 1 ? (past ? 'last year' : 'next year') : `${n} year${n > 1 ? 's' : ''}`),
  day: (n, past) => (n === 1 ? (past ? 'yesterday' : 'tomorrow') : `${n} day${n > 1 ? 's' : ''}`),
  week: (n, past) => (n === 1 ? (past ? 'last week' : 'next week') : `${n} week${n > 1 ? 's' : ''}`),
  hour: (n) => `${n} hour${n > 1 ? 's' : ''}`,
  minute: (n) => `${n} minute${n > 1 ? 's' : ''}`,
  second: (n) => `${n} second${n > 1 ? 's' : ''}`,
  invalid: '',
}

const DEFAULT_FORMATTER: TimeAgeFullDateFormatter = (date: Date) => date.toISOString().slice(0, 10)

export function formatTimeAgo<UnitNames extends string = TimeAgoUnitNamesDefault>(
  from: Date,
  options: FormatTimeAgoOptions<UnitNames> = {},
  now: Date | number = Date.now(),
): string {
  const {
    max,
    messages = DEFAULT_MESSAGES as TimeAgoMessages<UnitNames>,
    fullDateFormatter = DEFAULT_FORMATTER,
    units = DEFAULT_UNITS as TimeAgoUnit<UnitNames>[],
    showSecond = false,
    rounding = 'round',
  } = options

  const roundFn = isNumber(rounding) ? (n: number) => +n.toFixed(rounding) : Math[rounding]

  const diff = +now - +from
  const absDiff = Math.abs(diff)

  function getValue(diff: number, unit: TimeAgoUnit<UnitNames>) {
    return roundFn(Math.abs(diff) / unit.value)
  }

  function format(diff: number, unit: TimeAgoUnit<UnitNames>) {
    const val = getValue(diff, unit)
    const past = diff > 0

    const str = applyFormat(unit.name as UnitNames, val, past)
    return applyFormat(past ? 'past' : 'future', str, past)
  }

  function applyFormat(name: UnitNames | keyof TimeAgoMessagesBuiltIn, val: number | string, isPast: boolean) {
    const formatter = messages[name]
    if (isFunction(formatter)) return formatter(val as never, isPast)
    return formatter.replace('{0}', val.toString())
  }

  if (absDiff < 60000 && !showSecond) return messages.justNow

  if (isNumber(max) && absDiff > max) return fullDateFormatter(new Date(from))

  if (typeof max === 'string') {
    const unitMax = units.find((i) => i.name === max)?.max
    if (unitMax && absDiff > unitMax) return fullDateFormatter(new Date(from))
  }

  for (const [idx, unit] of units.entries()) {
    const val = getValue(diff, unit)
    if (val <= 0 && units[idx - 1]) return format(diff, units[idx - 1])
    if (absDiff < unit.max) return format(diff, unit)
  }

  return messages.invalid
}
