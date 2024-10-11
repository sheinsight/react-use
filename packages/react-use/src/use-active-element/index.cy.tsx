import { useActiveElement } from './index'

function App() {
  const activeElement = useActiveElement()
  const tagName = activeElement?.tagName.toLowerCase()
  const value = tagName ? `<${tagName} />` : 'null'

  return (
    <div>
      <div>Active element: {value}</div>
      <div>
        <input placeholder="Click here to test" />
        <button type="button">Also press here</button>
      </div>
    </div>
  )
}

describe('useActiveElement', () => {
  it('playground', () => {
    cy.mount(<App />)
    cy.get('input').click()
    expect(cy.get('div').contains('input')).to.exist
    cy.get('button').click()
    expect(cy.get('div').contains('button')).to.exist
    cy.get('body').click()
    expect(cy.get('div').contains('body')).to.exist
  })
})
