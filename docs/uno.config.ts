import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  content: {
    filesystem: ['{docs,src}/**/*.tsx', '../src/**/demo.tsx'],
  },
  presets: [
    presetUno({
      dark: { dark: 'html[class="dark"]' },
    }),
    presetIcons({
      cdn: 'https://esm.sh/',
      extraProperties: {
        display: 'inline-block',
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
