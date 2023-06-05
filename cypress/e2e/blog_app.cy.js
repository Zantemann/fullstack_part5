describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Santeri',
      username: 'Zante',
      password: '1234'
    }
    const user2 = {
      name: 'Santeri2',
      username: 'Zante2',
      password: '1234'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Zante')
      cy.get('#password').type('1234')
      cy.get('#login-button').click()

      cy.contains('Santeri logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Zante')
      cy.get('#password').type('1')
      cy.get('#login-button').click()
      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Zante', password: '1234' })
      cy.get('#create-new').click()
    })

    it('A blog can be created', function() {
      cy.get('#title').type('TestBlog')
      cy.get('#author').type('TestAuthor')
      cy.get('#url').type('TestUrl.com')
      cy.get('#create').click()
      cy.contains('a new blog TestBlog by TestAuthor added')
      cy.contains('TestBlog TestAuthor')
    })

    describe('When have blogs', function() {
      beforeEach(function() {
        cy.login({ username: 'Zante', password: '1234' })
        cy.createBlog({ title: 'createTest', url: 'http://createExample.com', author: 'createAuthor' })
        cy.contains('createTest createAuthor')
          .parent()
          .as('blog')
          .contains('view')
          .click()
      })

      it('A blog can be liked', function() {
        cy.get('@blog')
          .contains('like')
          .click()

        cy.get('@blog')
          .contains('Likes: 1')
      })

      it('A blog can be deleted', function() {
        cy.get('@blog').should('exist')
        cy.get('@blog')
          .contains('remove').click()
        cy.on('window:confirm', () => true)
        cy.contains('createTest createAuthor').should('not.exist')
      })
    })
  })

  describe('multiple users', function() {
    beforeEach(function() {
      cy.login({ username: 'Zante', password: '1234' })
      cy.createBlog({ title: 'createTest', url: 'http://createExample.com', author: 'createAuthor' })
      cy.contains('logout').click()
    })

    it('Only person hwo have added blog can delete it', function() {
      cy.login({ username: 'Zante2', password: '1234' })
      cy.contains('createTest createAuthor')
        .parent()
        .as('blog')
        .contains('view')
        .click()
      cy.get('@blog')
        .contains('remove').should('not.exist')
    })
  })

  describe('Blogs order', function() {
    beforeEach(function() {
      cy.login({ username: 'Zante2', password: '1234' })
      cy.createBlog({ title: 'middleLikes', url: 'http://createExample.com', author: 'createAuthor', likes: 1 })
      cy.createBlog({ title: 'mostLikes', url: 'http://createExample.com', author: 'createAuthor', likes: 2 })
      cy.createBlog({ title: 'lastLikes', url: 'http://createExample.com', author: 'createAuthor', likes: 0 })
    })

    it('Blogs are ordered by likes', function() {
      cy.get('.blog').eq(0).should('contain', 'mostLikes')
      cy.get('.blog').eq(1).should('contain', 'middleLikes')
      cy.get('.blog').eq(2).should('contain', 'lastLikes')

      cy.contains('middleLikes').parent().as('middle').contains('view').click()

      cy.get('@middle').contains('like').click()
      cy.get('@middle').contains('like').click()

      cy.get('.blog').eq(0).should('contain', 'middleLikes')
      cy.get('.blog').eq(1).should('contain', 'mostLikes')
      cy.get('.blog').eq(2).should('contain', 'lastLikes')
    })
  })
})