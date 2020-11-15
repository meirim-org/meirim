/* eslint-disable */
/// <reference types="cypress" />

context('Register and login', () => {
  beforeEach(() => {
    cy.server();
    cy.route({method: 'POST', url: '/api/sign/up*'}).as('signup');
    cy.route({method: 'POST', url: '/api/sign/in*'}).as('signin');

    cy.visit('http://localhost:3000');
  })

  describe('Registration flow', () => {
    it('alerts should not be visible from the get go', () => {
      cy.get('div.alert-danger')
        .should('not.be.visible');
      cy.get('div.alert-success')
        .should('not.be.visible');
    });

    it('register with an invalid email should not work', () => {
      cy.get('#register-email-input')
        .type('invalid@email.invalid')
        .get('#register-password-input')
        .type('123456')
        .get('#register-name-input')
        .type('myname');


      cy.get('#register-firststep-button')
        .click()
        
      cy.get('#register-email-input-helperText')
        .should('be.visible')
    });

    it('register with an valid email should work', () => {

      cy.get('#register-email-input')
        .type('test@meirim.org')
        .get('#register-password-input')
        .type('123456')
        .get('#register-name-input')
        .type('myname');

      cy.get('#register-firststep-button')
        .click()

      cy.get('#register-address-input')
        .type('myaddres')
        .get('#register-aboutme-input')
        .type('aboutmeee');

      cy.get('#register-send-form-button')
        .click()

      cy.get("#register-emailsent-sucess")
        .should('be.visible')
    });
  });

  describe('Login flow', () => {
    it('alerts should not be visible from the get go', () => {
      cy.get('#register-signin-link')
        .click();

      cy.url().should('include', '/sign/in');

      cy.get('div.alert-danger')
        .should('not.be.visible');
    });

    it('login with wrong credentials should not work', () => {
      cy.get('#register-signin-link')
        .click();

      cy.url().should('include', '/sign/in');

      cy.get('input#loginEmail')
        .type('invalid@email.invalid')
        .get('input#loginPassword')
        .type('1234');

      cy.get('form')
        .submit();

      cy.wait('@signin');

      cy.get('div.alert-danger')
        .should('be.visible');
    });

    it('login with existing credentials should work', () => {
      cy.get('#register-signin-link')
        .click();

      cy.url().should('include', '/sign/in');

      cy.get('input#loginEmail')
        .type('test@meirim.org')
        .get('input#loginPassword')
        .type('123456');

      cy.get('form')
        .submit();

      cy.wait('@signin');

      cy.get('div.alert-danger')
        .should('not.be.visible');

      cy.get('form.rectangle > .container-title')
        .should('be.visible');

      cy.url().should('include', '/alerts');
    });
  });
});
