import path from 'node:path'
import { themes as prismThemes } from 'prism-react-renderer'

import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

export default {
  title: '@shined/react-use',
  tagline: 'A simple yet powerful collection of React Hooks.',
  // favicon: 'img/favicon.ico',
  url: 'https://shined-hooks.vercel.app',
  baseUrl: '/react-use',
  organizationName: 'sheinsight',
  projectName: '@shined/react-use',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    // locales: ['en', 'zh-cn'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      // 'zh-cn': {
      //   label: '简体中文',
      // },
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
