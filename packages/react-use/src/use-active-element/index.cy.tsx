import { useActiveElement } from './index'

function App() {
  const activeElement = useActiveElement()
  const tagName = activeElement?.tagName.toLowerCase()
  const value = tagName ? `<${tagName} />` : 'null'

  return (
    <div>
      <div id="result">Active element: {value}</div>
      <div>
        <input placeholder="Click here to test" />
        <button type="button">Also press here</button>
      </div>
    </div>
  )
}

describe('useActiveElement', () => {
  beforeEach(() => {
    cy.mount(<App />)
  })

  it('should with initial default value', () => {
    expect(cy.get('#result').contains('body')).to.exist
  })

  it('should detect change', () => {
    cy.get('input').click()
    expect(cy.get('#result').contains('input')).to.exist
  })

  it('should detect multiple changes', () => {
    cy.get('input').click()
    expect(cy.get('#result').contains('input')).to.exist
    cy.get('button').click()
    expect(cy.get('#result').contains('button')).to.exist
    cy.get('body').click()
    expect(cy.get('#result').contains('body')).to.exist
  })

  it('should handle html click', () => {
    cy.mount(<App />)
    cy.get('html').click() // <html> click always link to <body>
    expect(cy.get('#result').contains('body')).to.exist
    cy.get('button').click()
    expect(cy.get('#result').contains('button')).to.exist
    cy.get('html').click() // <html> click always link to <body>
    expect(cy.get('#result').contains('body')).to.exist
  })
})
