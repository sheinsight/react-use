import react from '@vitejs/plugin-react'
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    specPattern: './packages/react-use/src/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [react()],
      },
    },
  },
})
