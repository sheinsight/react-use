import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { SearchHooks } from './components/search'
import Layout from '@theme/Layout'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout>
      <div className="grid place-content-center">
        <div className="flex gap-2 w-full flex-col md:gap-16 md:flex-row md:max-w-80vw">
          <div className="flex flex-col items-center gap-4 pt-20vh md:pt-24vh text-center">
            <span className="text-3.6rem">🪝</span>
            <h1 className="font-mono">{siteConfig.title}</h1>
            <p>{siteConfig.tagline}</p>
            <div className="flex gap-4">
              <Link to="/docs/introduction">&rarr; Introduction</Link>
              <Link to="/docs/get-started">&rarr; Get Started</Link>
              <Link to="/reference">&rarr; Reference</Link>
            </div>
          </div>
          <SearchHooks />
        </div>
      </div>
    </Layout>
  )
}
