import path from 'node:path'
import { themes as prismThemes } from 'prism-react-renderer'

import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'

export default {
  title: '@shined/use',
  tagline: 'A simple yet powerful collection of React hooks.',
  // favicon: 'img/favicon.ico',
  url: 'https://shined-hooks.vercel.app',
  baseUrl: '/use',
  organizationName: 'sheinsight',
  projectName: '@shined/use',
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
      name: 'postcss-unocss',
      configurePostCss(postcssOptions) {
        postcssOptions.plugins.push('@unocss/postcss')
        return postcssOptions
      },
    }),
    () => ({
      name: 'resolve-alias',
      configureWebpack() {
        return {
          resolve: {
            alias: {
              react: path.resolve('./node_modules/react'),
              'react/jsx-runtime': path.resolve('./node_modules/react/jsx-runtime'),
              '@shined/use': path.resolve('../src'),
              '@/components': path.resolve('./src/components'),
            },
          },
        }
      },
    }),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hooks',
        path: '../src',
        routeBasePath: '/reference/',
        editUrl: 'https://github.com/sheinsight/use/tree/main/reference/',
        include: ['**/*.{mdx,md}'],
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'changelogs',
        path: './changelog',
        routeBasePath: '/changelog',
        editUrl: 'https://github.com/sheinsight/use/tree/main/website/',
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
          editUrl: 'https://github.com/sheinsight/use/tree/main/website/',
          exclude: ['**/components/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        pages: {
          exclude: ['**/components/**'],
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: '@shined/use',
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
          to: '/changelog',
          label: 'Changelog',
          position: 'left',
        },
        {
          to: '/search',
          label: 'Hooks',
          position: 'right',
        },
        {
          href: 'https://github.com/sheinsight/use',
          label: 'GitHub',
          position: 'right',
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
