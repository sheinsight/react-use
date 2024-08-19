import { Button, CodeBlock, ReactUseIcon, useI18n, useRoutePath } from '@/components'
import { useDark } from 'rspress/runtime'

export function Main() {
  const t = useI18n()
  const isDark = useDark()

  return (
    <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-12vh">
      <ReactUseIcon />
      <h1 className="font-mono font-bold text-2xl md:text-4xl colorful-title">@shined/react-use</h1>
      <p className="text-wrap font-bold text-center text-lg md:text-4xl max-w-320px md:w-36vw md:max-w-600px md:text-left mb-0">
        {t('homepage.tagline')}
      </p>
      {/* <CodeBlock
        lang="sh"
        className="overflow-hidden"
        codeClassName="overflow-hidden"
        content="npm i @shined/react-use --save"
        theme={isDark ? 'one-dark-pro' : 'one-light'}
      /> */}
      <div className="flex gap-4 mt-8 md:gap-6 items-center">
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
