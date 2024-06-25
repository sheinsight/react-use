import path from 'node:path'
import { themes as prismThemes } from 'prism-react-renderer'

import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

export default {
  title: '@shined/react-use',
  tagline: 'An SSR-friendly, comprehensive, and highly optimized React Hooks library.',

  url: 'https://shined-hooks.vercel.app',
  baseUrl: '/react-use',
  organizationName: 'sheinsight',
  projectName: '@shined/react-use',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',

    locales: ['en', 'zh-cn'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      'zh-cn': {
        label: '简体中文',
      },
    },
  },
  plugins: [
    () => ({
      name: 'resolve-alias',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              react: path.resolve('./node_modules/react'),
              'react/jsx-runtime': path.resolve('./node_modules/react/jsx-runtime'),
              '@shined/react-use': path.resolve('../src'),
              '@/components': path.resolve('./src/components'),
            },
          },
        }
      },
    }),
    async () => {
      const { default: UnoCSS } = await import('@unocss/webpack')

      return {
        name: 'webpack-unocss',
        configureWebpack() {
          return {
            plugins: [UnoCSS()],
            optimization: {
              realContentHash: true,
            },
          }
        },
      }
    },
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hooks',
        path: '../src',
        routeBasePath: '/reference/',
        editUrl: 'https://github.com/sheinsight/react-use/tree/main/reference/',
        include: ['**/*.{mdx,md}'],
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          sidebarCollapsed: true,
          editUrl: 'https://github.com/sheinsight/react-use/tree/main/website/',
          exclude: ['components/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        pages: {
          exclude: ['components/**'],
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    algolia: {
      appId: 'W010WSW8YS',
      apiKey: 'ca07062d4601255978e437c86e29fc74',
      indexName: 'shined-react-use',
    },
    navbar: {
      title: '@shined/react-use',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Guide',
        },
        {
          to: '/reference',
          label: 'Reference',
          position: 'left',
        },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://react-online.vercel.app/#code=aW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnCmltcG9ydCB7IHVzZU1vdXNlLCB1c2VSZWFjdGl2ZSB9IGZyb20gJ0BzaGluZWQvcmVhY3QtdXNlJwoKCmZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHgsIHkgfSA9IHVzZU1vdXNlKCkKICBjb25zdCBbeyBjb3VudCB9LCBtdXRhdGVdID0gdXNlUmVhY3RpdmUoeyBjb3VudDogMCB9KQoKICBjb25zdCBhZGRPbmUgPSAoKSA9PiBtdXRhdGUuY291bnQrKwoKICByZXR1cm4gKAogICAgPGRpdj4KICAgICAgPGRpdj4oeCwgeSk6ICh7eH0sIHt5fSk8L2Rpdj4KICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthZGRPbmV9PkNvdW50OiB7Y291bnR9PC9idXR0b24%2BCiAgICA8L2Rpdj4KICApCn0KCmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcig8QXBwIC8%2BKQo%3D',
          label: 'Playground',
          position: 'right',
        },
        {
          href: 'https://github.com/sheinsight/react-use',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Releases',
          position: 'right',
          items: [
            {
              href: 'https://github.com/sheinsight/react-use/releases',
              label: 'Releases Notes',
            },
            {
              href: 'https://github.com/sheinsight/react-use/blob/main/CHANGELOG.md',
              label: 'CHANGELOG.md',
            },
          ],
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: `Copyright © 2024-${new Date().getFullYear()} @shined. Documentation is Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.oneDark,
    },
  } satisfies Preset.ThemeConfig,
} satisfies Config
