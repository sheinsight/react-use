import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export function Home() {
  const { siteConfig } = useDocusaurusContext()

  return (
    <header>
      <div className="flex flex-col items-center gap-4 pt-12vh text-center">
        <span className="text-3.6rem">🪝</span>
        <h1 className="font-mono">{siteConfig.title}</h1>
        <p>{siteConfig.tagline}</p>
        <div className="flex gap-4">
          <Link to="/docs/introduction">&rarr; Introduction</Link>
          <Link to="/docs/get-started">&rarr; Get Started</Link>
          <Link to="/search">&rarr; Search Hooks</Link>
        </div>
      </div>
    </header>
  )
}
