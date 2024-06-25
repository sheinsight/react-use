import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { Button } from '../components'
import { SearchHooks } from './components/search'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout>
      <div className="grid place-content-center">
        <div className="flex gap-2 w-full flex-col md:gap-12 md:flex-row md:max-w-78vw">
          <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-12vh">
            <span className="text-3.6rem">🪝</span>
            <h1 className="font-mono">{siteConfig.title}</h1>
            <div className="flex gap-2">
              <img
                alt="NPM Version"
                src="https://img.shields.io/npm/v/%40shined%2Freact-use?style=flat&labelColor=%23ffffff&color=%232e8555"
              />
              {/* <img src="https://pkg-size.dev/badge/bundle/108270" alt="Version Badge" /> */}
              <img
                src="https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome"
                alt="Biome Badge"
              />
            </div>
            <p className="md:max-w-400px">{siteConfig.tagline}</p>
            <div className="flex gap-4 items-center">
              <Link to="/docs/introduction">
                <Button>Introduction</Button>
              </Link>
              <Link to="/docs/get-started">Get Started</Link>
              <Link to="/reference">Reference</Link>
            </div>
          </div>
          <SearchHooks />
        </div>
      </div>
    </Layout>
  )
}
