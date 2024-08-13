import { Toaster as ToasterInternal } from 'react-hot-toast'
import { useI18n as useI18nInternal, useLang, withBase } from 'rspress/runtime'
export { default as cn } from 'classnames'

export * from 'react-hot-toast'
export * from '@formkit/auto-animate/react'

export const repoBase = 'https://github.com/sheinsight/react-use/blob/main/src'
export const defaultLang = 'en'

export const OTP = (): string => Math.random().toString(16).slice(-6).toUpperCase()
export const wait = (ms = 300, res: string = OTP()): Promise<string> =>
  new Promise((resolve) => setTimeout(() => resolve(res), ms))

export function useI18n() {
  return useI18nInternal<typeof import('i18n')>()
}

export function useNormalizedPath(path: string) {
  const lang = useLang()
  const suffix = lang === defaultLang ? '' : `/${lang}`
  return withBase(`${suffix}${path}`)
}

export function Toaster() {
  return <ToasterInternal position="bottom-right" containerClassName="m-16" />
}
