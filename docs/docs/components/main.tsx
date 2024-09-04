import { Button, CodeBlock, ReactUseIcon, cn, useI18n, useRoutePath } from '@/components'
import { useDark, useLang, useNavigate } from 'rspress/runtime'

export function Main() {
  const t = useI18n()
  const isZhCN = useLang() === 'zh-cn'
  const navigate = useNavigate()
  // const isDark = useDark()

  const [start, reference, github] = [
    useRoutePath('/docs/get-started'),
    useRoutePath('/reference'),
    useRoutePath('/docs/overview'),
  ]

  return (
    <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-12vh">
      <ReactUseIcon />
      <h1 className="font-mono font-bold text-2xl md:text-4xl colorful-title">@shined/react-use</h1>
      <p
        className={cn(
          'text-pretty font-bold text-center max-w-320px md:w-36vw md:max-w-600px md:text-left mb-0',
          isZhCN ? 'text-4xl md:text-6xl' : 'text-3xl md:text-5xl',
        )}
      >
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
        <Button className="md:w-120px" onClick={() => navigate(start)}>
          {t('homepage.get-started')}
        </Button>
        <a
          className="user-link"
          onClick={(e) => {
            e.preventDefault()
            navigate(reference)
          }}
          href={reference}
        >
          {t('homepage.reference')}
        </a>
        <a
          className="user-link"
          onClick={(e) => {
            e.preventDefault()
            navigate(github)
          }}
          href={github}
        >
          {t('homepage.github')}
        </a>
      </div>
    </div>
  )
}
