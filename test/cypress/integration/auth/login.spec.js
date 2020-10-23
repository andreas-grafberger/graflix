describe('The user', () => {
  before(() => {
    cy.fixture('users').then(users => {
      users.forEach((user) => {
        cy.request('POST', '/api/auth/register', user)
      })
    })
  })

  beforeEach(() => {
    cy.clearCookies()
  })

  it('is initially logged out', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('is redirected on login', () => {
    cy.visit('/login')
    cy.get('#Chris\\@test\\.com > .user-tile-box').click()
    cy.url().should('equal', Cypress.config().baseUrl + '/')
  })

  it('gets a cookie on login', () => {
    cy.visit('/login')
    cy.getCookies().should('be.empty')
    cy.get('#Chris\\@test\\.com > .user-tile-box').click()
    cy.wait(200)
    cy.getCookie('jwt').should('exist')
  })
})
