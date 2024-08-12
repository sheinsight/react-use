import fs from 'node:fs'
import path from 'node:path'
import { camelCase, capitalCase } from 'change-case'
import matter from 'gray-matter'
import { defineConfig } from 'rspress/config'

import { locale } from './locale'

import type { LocaleConfig, RspressPlugin } from '@rspress/shared'

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
    .readdirSync(path.join(__dirname, '../src'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && ignoredDirs.every((e) => e !== d.name))

  const routes = hooks.flatMap((dir) => {
    const enPath = path.join(__dirname, '../src', dir.name, 'index.mdx')
    const zhCNPath = path.join(__dirname, '../src', dir.name, 'index.zh-cn.mdx')

    if (!fs.existsSync(enPath)) {
      return []
    }

    const { data } = matter(fs.readFileSync(enPath, 'utf-8'))
    const category = data.type || data.category || 'Uncategorized'
    categories.set(category, (categories.get(category) ?? []).concat(dir.name))

    return [
      {
        routePath: `/en/reference/${dir.name}`,
        filepath: enPath,
      },
      {
        routePath: `/zh-cn/reference/${dir.name}`,
        filepath: fs.existsSync(zhCNPath) ? zhCNPath : enPath,
      },
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
      for (const locale of (config.themeConfig?.locales ?? []) as LocaleConfig[]) {
        locale.sidebar ??= {}
        const path = `${locale.lang === 'en' ? '' : `/${locale.lang}`}/reference`

        locale.sidebar[path] = Array.from(categories.entries()).map(([category, hooks]) => ({
          text: capitalCase(category),
          collapsed: true,
          items: hooks.map((hook) => ({
            text: camelCase(hook),
            link: `${path}/${hook}`,
          })),
        }))

        locale.sidebar[path].unshift({
          text: locale.lang === 'en' ? 'Categories Overview' : 'Hooks 分类概览',
          link: path,
        })
      }

      return config
    },
  }
}

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/react-use/',
  lang: 'en',
  icon: '/icon.svg',
  logo: {
    dark: '/logo-dark.svg',
    light: '/logo-light.svg',
  },
  search: {
    versioned: true,
  },
  route: {
    exclude: ['./**/{components,hooks,utils}/**/*'],
    cleanUrls: true,
  },
  plugins: [hooksDocPlugin()],
  themeConfig: {
    darkMode: true,
    socialLinks: [{ icon: 'github', mode: 'link', content: 'https://github.com/sheinsight/react-use' }],
    locales: [locale.en, locale.zhCN],
  },
  builderConfig: {
    source: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
})
