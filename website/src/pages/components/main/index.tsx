import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import { useColorMode } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Button } from '@site/src/components'
import Logo from '@site/static/logo.svg'
import { CodeBlock } from '../../../../../docs/src/components/code-block'

export function Main() {
  const { colorMode } = useColorMode()
  const { siteConfig } = useDocusaurusContext()

  return (
    <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-12vh">
      <Logo className="size-32" />
      <h1 className="font-mono">{siteConfig.title}</h1>
      <div className="flex gap-2">
        <img
          alt="NPM Version"
          src="https://img.shields.io/npm/v/%40shined%2Freact-use?style=flat&labelColor=%23ffffff&color=%232e8555"
        />
        <img src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome" alt="Biome Badge" />
        <img src="https://pkg-size.dev/badge/bundle/108270" alt="Version Badge" />
      </div>
      <p className="text-pretty text-center max-w-320px md:max-w-400px md:text-left mb-0">
        <Translate id="homepage.tagline">
          A SSR-friendly, comprehensive, standardized and highly optimized React Hooks library.
        </Translate>
      </p>
      <CodeBlock
        lang="sh"
        className="overflow-hidden"
        codeClassName="overflow-hidden"
        content="npm i @shined/react-use --save"
        theme={colorMode === 'dark' ? 'one-dark-pro' : 'one-light'}
      />
      <div className="flex gap-4 md:gap-6 items-center">
        <Link to="/docs/introduction">
          <Button className="md:w-120px">
            <Translate id="homepage.button.introduction">Introduction</Translate>
          </Button>
        </Link>
        <Link to="/docs/get-started">
          <Translate id="homepage.button.getStarted">Get Started</Translate>
        </Link>
        <Link to="/reference">
          <Translate id="homepage.button.reference">Reference</Translate>
        </Link>
      </div>
    </div>
  )
}
