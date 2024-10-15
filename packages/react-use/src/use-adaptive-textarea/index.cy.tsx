import { useAdaptiveTextarea } from './index'

function App() {
  const ta = useAdaptiveTextarea()

  return (
    <textarea
      id="ta"
      ref={ta.ref}
      defaultValue="some text"
      style={{
        resize: 'none',
        fontSize: '16px',
        fontFamily: 'sans-serif',
        padding: '4px 8px',
        width: '160px',
        lineHeight: '24px',
      }}
    />
  )
}

describe('useAdaptiveTextarea', () => {
  beforeEach(() => {
    cy.mount(<App />)
  })

  it('should resize', () => {
    cy.get('#ta').type('more text')
    cy.get('#ta').should('have.css', 'height', '24px')
  })

  it('should resize multiple lines', () => {
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
  })

  it('should resize multiple lines with backspace', () => {
    cy.get('#ta').type('{enter}more text{backspace}{backspace}{backspace}')
    cy.get('#ta').should('have.css', 'height', '48px')
  })

  it('should resize multiple lines with delete', () => {
    cy.get('#ta').type('{enter}more text{leftarrow}{leftarrow}{leftarrow}{del}{del}{del}')
    cy.get('#ta').should('have.css', 'height', '48px')
  })

  it('should resize multiple lines with paste', () => {
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
    cy.get('#ta').type('{selectall}{del}')
    cy.get('#ta').should('have.css', 'height', '24px')
    cy.get('#ta').type('{ctrl}v')
    cy.get('#ta').should('have.css', 'height', '24px')
  })

  it('should resize multiple lines with cut', () => {
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
    cy.get('#ta').type('{selectall}{ctrl}x')
    cy.get('#ta').should('have.css', 'height', '24px')
  })

  it('should resize multiple lines with undo', () => {
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
    cy.get('#ta').type('{ctrl+z}')
    cy.get('#ta').should('have.css', 'height', '48px')
  })

  it('should resize multiple lines with redo', () => {
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
    cy.get('#ta').type('{selectAll}{del}some text')
    cy.get('#ta').should('have.css', 'height', '24px')
    cy.get('#ta').type('{enter}more text')
    cy.get('#ta').should('have.css', 'height', '48px')
  })
})
