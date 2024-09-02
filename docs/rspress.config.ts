import fs from 'node:fs'
import path from 'node:path'
import { pluginShiki } from '@rspress/plugin-shiki'
import { camelCase, kebabCase } from 'change-case'
import gm from 'gray-matter'
import { rimrafSync } from 'rimraf'
import { pluginGoogleAnalytics } from 'rsbuild-plugin-google-analytics'
import { defineConfig } from 'rspress/config'

import hooks from './hooks.json'
import i18n from './i18n.json'
import { locale, version } from './locale'

import type { RspressPlugin } from '@rspress/shared'

// disable cache to avoid dev cache not match error
if (process.env.NODE_ENV === 'development') {
  rimrafSync(path.join(__dirname, './build'))
}

const base = '/react-use/'
const assetsPrefix = 'https://sheinsight.github.io/react-use/'
const plugins: RspressPlugin[] = [reactUseRspressPlugin(), pluginShiki({ theme: 'one-dark-pro' })]
const builderPlugins: ReturnType<typeof pluginGoogleAnalytics>[] = []

if (process.env.IS_SODOC) {
  plugins.push(require('@shein/rspress-plugin-sodoc')(), replaceAssetsPrefixPlugin())
} else {
  builderPlugins.push(pluginGoogleAnalytics({ id: 'G-M3K3LXN4J9' }))
}

export default defineConfig({
  root: path.resolve(__dirname, './docs'),
  base,
  lang: 'en',
  icon: '/icon.svg',
  title: '@shined/react-use',
  description: i18n['homepage.tagline'].en,
  outDir: 'build',
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
  plugins,
  themeConfig: {
    // enableContentAnimation: true,
    enableScrollToTop: true,
    darkMode: !process.env.IS_SODOC,
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/sheinsight/react-use',
      },
    ],
    locales: [locale.en, locale.zhCN],
  },
  builderPlugins,
  builderConfig: {
    html: {
      tags: process.env.IS_SODOC ? [{ tag: 'script', children: "window.RSPRESS_THEME = 'light';" }] : [],
    },
    output: {
      cleanDistPath: true,
    },
    source: {
      alias: {
        '@shined/react-use': path.resolve(__dirname, './node_modules/@shined/react-use'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@@': path.resolve(__dirname, './'),
        '@': path.resolve(__dirname, './src'),
      },
      define: {
        'process.env.ASSETS_PREFIX': JSON.stringify(assetsPrefix),
        'process.env.REACT_USE_VERSION': JSON.stringify(version),
      },
    },
  },
})

function reactUseRspressPlugin(): RspressPlugin {
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

  const routes = hooks.flatMap((hook) => {
    const enPath = path.resolve(__dirname, '../packages/react-use/src', hook.slug, 'index.mdx')
    const zhCNPath = path.resolve(__dirname, '../packages/react-use/src', hook.slug, 'index.zh-cn.mdx')

    if (!fs.existsSync(enPath)) return []

    const { data } = gm(fs.readFileSync(enPath, 'utf-8'))
    const category = data.type || data.category || 'Uncategorized'
    categories.set(category, (categories.get(category) ?? []).concat(hook.slug))

    // currently only `en` & `zh-cn` supported
    return [
      { routePath: `/en/reference/${hook.slug}`, filepath: enPath },
      { routePath: `/zh-cn/reference/${hook.slug}`, filepath: fs.existsSync(zhCNPath) ? zhCNPath : enPath },
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

function replaceAssetsPrefixPlugin(): RspressPlugin {
  return {
    name: 'replace-assets-prefix',
    config(config) {
      const addPrefix = (url?: string) => `${assetsPrefix}${url?.replace(/^\/+/, '') ?? ''}`

      config.icon = addPrefix(config.icon)
      config.logo = typeof config.logo === 'string' ? { dark: config.logo, light: config.logo } : config.logo

      config.logo = {
        dark: addPrefix(config.logo?.dark),
        light: addPrefix(config.logo?.light),
      }

      return config
    },
  }
}
