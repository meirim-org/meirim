/* eslint-disable */
/// <reference types="cypress" />

context('Register and login', () => {
  // emails won't actually be sent since we are using ethereal as the
  // smtp service when running these tests
  const userEmail = `rnd+${Date.now()}@meirim.org`;

  beforeEach(() => {
    cy.viewport('macbook-13');
    cy.server();
    cy.route({method: 'POST', url: '/api/sign/up*'}).as('signup');
    cy.route({method: 'POST', url: '/api/sign/in*'}).as('signin');

    cy.visit('http://localhost:3000');
  });

  describe('Registration flow', () => {
    it('alerts should not be visible from the get go', () => {
      cy.get('div.alert-danger')
        .should('not.be.visible');

      cy.get('div.alert-success')
        .should('not.be.visible');
    });

    it('register with an invalid email should not work', () => {
      cy.get('#sign-up')
        .click();

      cy.get('#register-email-input')
        .type('invalidemail.invalid')
        .get('#register-password-input')
        .type('123456')
        .get('#register-name-input')
        .type('myname');

      cy.get('#register-firststep-button')
        .click();

      cy.get('#register-email-input-helperText')
        .should('be.visible');
    });

    it('register with an valid email should work', () => {
      cy.get('#sign-up')
        .click();

      cy.get('#register-email-input')
        .type(userEmail)
        .get('#register-password-input')
        .type('123456')
        .get('#register-name-input')
        .type('myname');

      cy.get('#register-firststep-button')
        .click();

      cy.get('#register-address-input')
        .type('myaddres')
      
      cy.get('#register-type-input').click();

      cy.wait(100);

      cy.get('.MuiMenuItem-root').eq(1).click()

        
      cy.get('#register-aboutme-input')
        .type('aboutmeee');

      cy.get('#register-send-form-button')
        .click();

      cy.wait('@signup').then(xhr => {
        cy.get("#register-emailsent-sucess")
        .should('be.visible');  
      });
    });
  });

  describe('LogIn flow', () => {
    it('alerts should not be visible from the get go', () => {
      cy.get('#sign-in')
        .click();

      cy.get('div.alert-danger')
        .should('not.be.visible');
    });

    it('login with wrong credentials should not work', () => {
      cy.get('#sign-in')
        .click();

      cy.get('#login-email-input')
        .type('invalid@email.invalid')
        .get('#login-password-input')
        .type('123456');

      cy.get('#login-button')
        .click();

      cy.get('#403message')
        .should('be.visible');
        
      cy.get('#401message')
        .should('be.visible');
    });

    it('login with existing credentials should work', () => {
      cy.get('#sign-in')
        .click();

      cy.get('#login-email-input')
        .type(userEmail)
        .get('#login-password-input')
        .type('123456');

      cy.get('#login-button')
        .click();

      cy.get('div.alert-danger')
        .should('not.be.visible');

      cy.get('#alert-map-container > .container-title')
        .should('be.visible');

      cy.url().should('include', '/alerts');
    });
  });
});
