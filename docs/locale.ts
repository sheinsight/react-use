import i18n from './i18n.json'
import { version } from './package.json'

import type { LocaleConfig } from '@rspress/shared'

const langSlug = {
  en: 'en',
  zhCN: 'zh-cn',
}

export { version }

export const sidebar = {
  en: {
    '/docs': [
      {
        text: '🏃 Get Started',
        link: '/docs/get-started',
      },
      {
        text: '🔍 Overview',
        link: '/docs/overview',
      },
      {
        text: '🧭 Usage Guide',
        link: '/docs/usage-guide',
      },
      {
        text: '✨ Features',
        items: [
          {
            text: '🕸 Dependencies Collection',
            link: '/docs/features/dependencies-collection',
          },
          {
            text: '🎯 ElementTarget',
            link: '/docs/features/element-target',
          },
          {
            text: '🚥 Ref Getter',
            link: '/docs/features/ref-getter',
          },
          {
            text: '⏸️ Pausable',
            link: '/docs/features/pausable',
          },
        ],
        collapsed: false,
      },
      {
        text: '⚡️ Optimization',
        items: [
          {
            text: '🔒 Safe State',
            link: '/docs/optimization/safe-state',
          },
          {
            text: '📌 Stabilization',
            link: '/docs/optimization/stabilization',
          },
          {
            text: '🪄 Latest State',
            link: '/docs/optimization/latest-state',
          },
        ],
        collapsed: false,
      },
      {
        text: '❓ FAQs',
        items: [
          {
            text: '❓ How to use ElementTarget',
            link: '/docs/faqs/element-target',
          },
        ],
        collapsed: false,
      },
    ],
  },
  zhCN: {
    '/zh-cn/docs': [
      {
        text: '🏃 起步',
        link: `/${langSlug.zhCN}/docs/get-started`,
      },
      {
        text: '🔍 概览',
        link: `/${langSlug.zhCN}/docs/overview`,
      },
      {
        text: '🧭 使用指引',
        link: `/${langSlug.zhCN}/docs/usage-guide`,
      },
      {
        text: '✨ 功能特性',
        items: [
          {
            text: '🕸 依赖收集',
            link: `/${langSlug.zhCN}/docs/features/dependencies-collection`,
          },
          {
            text: '🎯 元素目标',
            link: `/${langSlug.zhCN}/docs/features/element-target`,
          },
          {
            text: '🚥 Ref 获取函数',
            link: `/${langSlug.zhCN}/docs/features/ref-getter`,
          },
          {
            text: '⏸️ 可暂停',
            link: `/${langSlug.zhCN}/docs/features/pausable`,
          },
        ],
        collapsed: false,
      },
      {
        text: '⚡️ 内部优化',
        items: [
          {
            text: '🔒 安全状态',
            link: `/${langSlug.zhCN}/docs/optimization/safe-state`,
          },
          {
            text: '📌 函数稳定化',
            link: `/${langSlug.zhCN}/docs/optimization/stabilization`,
          },
          {
            text: '🪄 最新值',
            link: `/${langSlug.zhCN}/docs/optimization/latest-state`,
          },
        ],
        collapsed: false,
      },
      {
        text: '❓ 常见问题',
        items: [
          {
            text: '❓ 如何使用 ElementTarget',
            link: `/${langSlug.zhCN}/docs/faqs/element-target`,
          },
        ],
        collapsed: false,
      },
    ],
  },
} satisfies Record<string, LocaleConfig['sidebar']>

export const navbar = {
  en: [
    {
      text: 'Guide',
      link: '/docs/get-started',
      activeMatch: '^/docs/',
    },
    {
      text: 'Reference',
      link: '/reference',
    },
    {
      text: 'Roadmap',
      link: '/roadmap',
    },
    {
      text: `v${version}`,
      items: [
        {
          text: 'Release Notes',
          link: 'https://github.com/sheinsight/react-use/releases',
        },
        {
          text: 'CHANGELOG.md',
          link: 'https://github.com/sheinsight/react-use/blob/main/CHANGELOG.md',
        },
        {
          text: 'Playground',
          link: 'https://react-online.vercel.app/#code=aW1wb3J0IHsgY3JlYXRlIH0gZnJvbSAnQHNoaW5lZC9yZWFjdGl2ZScKaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnCmltcG9ydCB7IHVzZU1vdXNlLCB1c2VSZWFjdGl2ZSB9IGZyb20gJ0BzaGluZWQvcmVhY3QtdXNlJwoKCmZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHgsIHkgfSA9IHVzZU1vdXNlKCkKICBjb25zdCBbeyBjb3VudCB9LCBtdXRhdGVdID0gdXNlUmVhY3RpdmUoeyBjb3VudDogMCB9LCB7IGNyZWF0ZSB9KQoKICBjb25zdCBhZGRPbmUgPSAoKSA9PiBtdXRhdGUuY291bnQrKwoKICByZXR1cm4gKAogICAgPGRpdj4KICAgICAgPGRpdj4oeCwgeSk6ICh7eH0sIHt5fSk8L2Rpdj4KICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthZGRPbmV9PkNvdW50OiB7Y291bnR9PC9idXR0b24%2BCiAgICA8L2Rpdj4KICApCn0KCmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcig8QXBwIC8%2BKQo%3D',
        },
      ],
    },
  ],
  zhCN: [
    {
      text: '上手指南',
      link: `/${langSlug.zhCN}/docs/get-started`,
      activeMatch: `^/${langSlug.zhCN}/docs/`,
    },
    {
      text: 'Hooks 列表',
      link: `/${langSlug.zhCN}/reference`,
    },
    {
      text: '后期规划',
      link: `/${langSlug.zhCN}/roadmap`,
    },
    {
      text: `v${version}`,
      items: [
        {
          text: '发布日志',
          link: 'https://github.com/sheinsight/react-use/releases',
        },
        {
          text: 'CHANGELOG.md',
          link: 'https://github.com/sheinsight/react-use/blob/main/CHANGELOG.md',
        },
        {
          text: '演练场',
          link: 'https://react-online.vercel.app/#code=aW1wb3J0IHsgY3JlYXRlIH0gZnJvbSAnQHNoaW5lZC9yZWFjdGl2ZScKaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gJ3JlYWN0LWRvbS9jbGllbnQnCmltcG9ydCB7IHVzZU1vdXNlLCB1c2VSZWFjdGl2ZSB9IGZyb20gJ0BzaGluZWQvcmVhY3QtdXNlJwoKCmZ1bmN0aW9uIEFwcCgpIHsKICBjb25zdCB7IHgsIHkgfSA9IHVzZU1vdXNlKCkKICBjb25zdCBbeyBjb3VudCB9LCBtdXRhdGVdID0gdXNlUmVhY3RpdmUoeyBjb3VudDogMCB9LCB7IGNyZWF0ZSB9KQoKICBjb25zdCBhZGRPbmUgPSAoKSA9PiBtdXRhdGUuY291bnQrKwoKICByZXR1cm4gKAogICAgPGRpdj4KICAgICAgPGRpdj4oeCwgeSk6ICh7eH0sIHt5fSk8L2Rpdj4KICAgICAgPGJ1dHRvbiBvbkNsaWNrPXthZGRPbmV9PkNvdW50OiB7Y291bnR9PC9idXR0b24%2BCiAgICA8L2Rpdj4KICApCn0KCmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcig8QXBwIC8%2BKQo%3D',
        },
      ],
    },
  ],
} satisfies Record<string, LocaleConfig['nav']>

export const locale = {
  en: {
    lang: 'en',
    label: 'English',
    title: '@shined/react-use',
    description: i18n['homepage.tagline'].en,
    lastUpdatedText: 'Updated at',
    lastUpdated: !process.env.IS_SODOC,
    prevPageText: 'Previous',
    nextPageText: 'Next',
    searchPlaceholderText: 'Search...',
    searchNoResultsText: 'No results found',
    searchSuggestedQueryText: 'Try different keywords?',
    nav: navbar.en,
    sidebar: sidebar.en,
  },
  zhCN: {
    lang: 'zh-cn',
    label: '简体中文',
    title: '@shined/react-use',
    description: i18n['homepage.tagline']['zh-cn'],
    lastUpdatedText: '更新于',
    lastUpdated: !process.env.IS_SODOC,
    prevPageText: '上一页',
    nextPageText: '下一页',
    searchPlaceholderText: '搜索...',
    searchNoResultsText: '没有找到相关结果',
    searchSuggestedQueryText: '试试不同的关键词？',
    nav: navbar.zhCN,
    sidebar: sidebar.zhCN,
  },
} satisfies Record<string, LocaleConfig>
