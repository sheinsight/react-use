import Layout from '@theme/Layout'
import { Main } from './components/main'
import { SearchHooks } from './components/search'

export default function Home() {
  return (
    <Layout>
      <div className="grid place-content-center">
        <div className="flex gap-2 w-full flex-col md:gap-12 md:flex-row md:max-w-78vw">
          <Main />
          <SearchHooks />
        </div>
      </div>
    </Layout>
  )
}
