import { isProduction, useI18n as useI18nInternal, useLang, usePageData, withBase } from 'rspress/runtime'
import { defaultLang } from '.'

export function useI18n() {
  return useI18nInternal<typeof import('i18n')>()
}

export function useAssetsPath(path: string) {
  const isProd = isProduction()
  if (!isProd) return path

  const { siteData } = usePageData()
  const assetsPrefix = process.env.ASSETS_PREFIX || siteData.base || '/'
  return `${assetsPrefix}${path.replace(/^\/+/, '')}`
}

export function useRoutePath(path: string) {
  const lang = useLang()
  const suffix = lang === defaultLang ? '/' : `/${lang}/`
  return withBase(`${suffix}${path.replace(/^\/+/, '')}`)
}
