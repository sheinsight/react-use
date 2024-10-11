import { useQuery } from './index'

function App() {
  const query = useQuery(
    async () => (await (await fetch('/mock-fetch-data')).json()) as (typeof mockRequestList)[0]['response'],
  )

  return (
    <div>
      <div id="result">{query.data?.name || '[null]'}</div>
    </div>
  )
}

const mockRequestList = [
  {
    name: 'mockFetchData',
    routerMatcher: { method: 'GET', url: '/mock-fetch-data' },
    response: {
      name: 'useQuery',
      description: 'React Hooks Library',
    },
  },
  {
    name: 'mockCreatePost',
    routerMatcher: { method: 'GET', url: '/mock-create-post' },
    response: { message: 'ok', status: 0 },
  },
] as const

describe('useQuery', () => {
  beforeEach(() => {
    for (const req of mockRequestList) {
      cy.intercept(req.routerMatcher, req.response).as(req.name)
    }
    cy.mount(<App />)
  })

  it('should handle response data', () => {
    cy.wait['@mockFetchData' as never]
    expect(cy.get('#result').contains('useQuery')).to.exist
  })
})
