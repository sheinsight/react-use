import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['{docs,src}/**/*', '../src/**/demo.tsx'],
  },
  presets: [
    presetUno({
      dark: { dark: 'html[class="dark"]' },
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'mask-image': 'var(--un-icon)',
        'mask-size': '100% 100%',
        'mask-repeat': 'no-repeat',
      },
    }),
  ],
  theme: {
    colors: {
      primary: '#2e8555',
    },
  },
  shortcuts: {
    'transparent-border': 'rounded border-2 border-solid border-transparent',
    'input-border': 'transparent-border dark:bg-white/12 hover:border-primary/48 focus:border-primary/80',
  },
})
