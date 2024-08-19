import { Button, CodeBlock, ReactUseIcon, useI18n, useRoutePath } from '@/components'
import { useDark } from 'rspress/runtime'

export function Main() {
  const t = useI18n()
  const isDark = useDark()

  return (
    <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-12vh">
      <ReactUseIcon />
      <h1 className="font-mono font-bold text-3xl">@shined/react-use</h1>
      <div className="flex gap-2">
        <img
          alt="NPM Version"
          src="https://img.shields.io/npm/v/%40shined%2Freact-use?style=flat&labelColor=%23ffffff&color=%232e8555"
        />
        <img src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome" alt="Biome Badge" />
        <img src="https://pkg-size.dev/badge/bundle/108270" alt="Version Badge" />
      </div>
      <p className="text-pretty text-center max-w-320px md:max-w-400px md:text-left mb-0">{t('homepage.tagline')}</p>
      <CodeBlock
        lang="sh"
        className="overflow-hidden"
        codeClassName="overflow-hidden"
        content="npm i @shined/react-use --save"
        theme={isDark ? 'one-dark-pro' : 'one-light'}
      />
      <div className="flex gap-4 md:gap-6 items-center">
        <a href={useRoutePath('/docs/introduction')}>
          <Button className="md:w-120px">{t('homepage.introduction')}</Button>
        </a>
        <a className="user-link" href={useRoutePath('/docs/get-started')}>
          {t('homepage.get-started')}
        </a>
        <a className="user-link" href={useRoutePath('/reference')}>
          {t('homepage.reference')}
        </a>
      </div>
    </div>
  )
}
