import fs from 'node:fs'
import path from 'node:path'
import { camelCase, kebabCase } from 'change-case'
import gm from 'gray-matter'
import { rimrafSync } from 'rimraf'
import { defineConfig } from 'rspress/config'

import i18n from './i18n.json'
import { locale } from './locale'

import type { RspressPlugin } from '@rspress/shared'

// disable cache to avoid dev cache not match error
rimrafSync(path.join(__dirname, './dist'))

const hooksDocPlugin = (): RspressPlugin => {
  const ignoredDirs = ['utils']

  const categories = new Map<string, string[]>([
    ['State', []],
    ['Lifecycle', []],
    ['Browser', []],
    ['Element', []],
    ['Sensors', []],
    ['Network', []],
    ['Animation', []],
    ['Utilities', []],
    ['ProUtilities', []],
  ])

  const hooks = fs
    .readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && ignoredDirs.every((e) => e !== d.name))

  const routes = hooks.flatMap((dir) => {
    const enPath = path.resolve(__dirname, '../src', dir.name, 'index.mdx')
    const zhCNPath = path.resolve(__dirname, '../src', dir.name, 'index.zh-cn.mdx')

    if (!fs.existsSync(enPath)) {
      return []
    }

    const { data } = gm(fs.readFileSync(enPath, 'utf-8'))
    const category = data.type || data.category || 'Uncategorized'
    categories.set(category, (categories.get(category) ?? []).concat(dir.name))

    // currently only `en` & `zh-cn` supported
    return [
      { routePath: `/en/reference/${dir.name}`, filepath: enPath },
      { routePath: `/zh-cn/reference/${dir.name}`, filepath: fs.existsSync(zhCNPath) ? zhCNPath : enPath },
    ]
  })

  for (const [category, hooks] of categories.entries()) {
    if (hooks.length === 0) {
      categories.delete(category)
    }
  }

  return {
    name: 'plugin-hooks-documentation',
    addPages(config, isProd) {
      return routes
    },
    config(config) {
      config.themeConfig ??= { locales: [] }
      config.themeConfig.locales ??= []

      for (const locale of config.themeConfig.locales) {
        locale.sidebar ??= {}
        const path = `${locale.lang === 'en' ? '' : `/${locale.lang}`}/reference`

        locale.sidebar[path] = Array.from(categories.entries()).map(([category, hooks]) => {
          const i18nItem = i18n[`reference.sidebar.${kebabCase(category)}` as never]

          return {
            text: i18nItem?.[locale.lang] ?? camelCase(category),
            collapsed: true,
            items: hooks.map((hook) => ({
              text: camelCase(hook),
              link: `${path}/${hook}`,
            })),
          }
        })

        locale.sidebar[path].unshift({
          text: i18n['reference.sidebar.overview'][locale.lang as never] ?? 'Categories Overview',
          link: path,
        })
      }

      return config
    },
  }
}

export default defineConfig({
  root: path.resolve(__dirname, './docs'),
  base: '/react-use/',
  lang: 'en',
  icon: '/icon.svg',
  title: '@shined/react-use',
  description: i18n['homepage.tagline'].en,
  logo: {
    dark: '/logo-dark.svg',
    light: '/logo-light.svg',
  },
  search: {
    versioned: true,
  },
  route: {
    exclude: ['**/{components,hooks,utils}/**/*'],
    cleanUrls: true,
  },
  plugins: [hooksDocPlugin()],
  themeConfig: {
    darkMode: true,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/sheinsight/react-use',
      },
    ],
    locales: [locale.en, locale.zhCN],
  },
  outDir: 'dist',
  builderConfig: {
    source: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@@': path.resolve(__dirname, './'),
      },
    },
  },
})
