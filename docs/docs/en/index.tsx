import { Main } from '../components/main'
import { SearchHooks } from '../components/search'

export const frontmatter = {
  pageType: 'custom',
}

export default function Homepage() {
  return (
    <div className="grid place-content-center">
      <div className="flex gap-2 w-full flex-col md:gap-4 md:flex-row md:max-w-78vw">
        <Main />
        <SearchHooks />
      </div>
    </div>
  )
}
