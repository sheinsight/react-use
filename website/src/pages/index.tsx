import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { SearchHooks } from './components/search'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout>
      <div className="grid place-content-center">
        <div className="flex gap-2 w-full flex-col md:gap-12 md:flex-row md:max-w-78vw">
          <div className="flex flex-col items-center md:items-start gap-4 pt-20vh md:pt-16vh">
            <span className="text-3.6rem">🪝</span>
            <h2 className="font-mono">{siteConfig.title}</h2>
            <p>{siteConfig.tagline}</p>
            <div className="flex md:flex-col gap-4">
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
