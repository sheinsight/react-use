import * as path from 'node:path'
import { defineConfig } from 'rspress/config'

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  base: '/react-use/',
  title: '@shined/react-use',
  description:
    'A SSR-friendly, comprehensive, standardized and highly optimized React Hooks library.',
  icon: '/icon.svg',
  logo: {
    'dark': '/logo-dark.svg',
    'light': '/logo-light.svg',
  },
  lang: 'en',
  multiVersion: {
    default: 'v1',
    versions: ['v1'],
  },
  themeConfig: {
    darkMode: true,
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/sheinsight/react-use' },
    ],
    locales: [
      {
        lang: 'en',
        label: 'English',
        title: '@shined/react-use',
        description:
          'A SSR-friendly, comprehensive, standardized and highly optimized React Hooks library.',
        lastUpdatedText: 'Last Updated at',
        lastUpdated: true,
        prevPageText: 'Previous',
        nextPageText: 'Next',
        searchPlaceholderText: 'Search...',
        searchNoResultsText: 'No results found',
        searchSuggestedQueryText: 'Try different keywords?',
      },
      {
        lang: 'zh-cn',
        label: '简体中文',
        title: '@shined/react-use',
        description: '一个 SSR 友好、全面、标准化和高度优化的 React Hooks 库。',
        lastUpdatedText: '最后更新于',
        lastUpdated: true,
        prevPageText: '上一页',
        nextPageText: '下一页',
        searchPlaceholderText: '搜索...',
        searchNoResultsText: '没有找到相关结果',
        searchSuggestedQueryText: '试试不同的关键词？',
      },
    ],
  },
  search: {
    versioned: true,
  },
  route: {
    exclude: ['{components,hooks,utils}/**/*'],
  },
  builderConfig: {
    // html: { tags: [{ tag: 'script', children: "window.RSPRESS_THEME = 'dark';" }] },
    source: {
      alias: {
        '@': './src',
      },
    },
  },
})
