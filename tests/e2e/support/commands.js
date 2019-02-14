// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("application", () => cy.window().its("Application"));
Cypress.Commands.add("nextTick", callback => cy.application().then(app => app.$nextTick(() => callback(app))));
Cypress.Commands.add(
  "login",
  ({
    user = "admin",
    password = "secret",
    jwtFixture = undefined,
    userFixture = undefined,
    redirectPath = "/"
  } = {}) => {
    cy.visit("/");
    cy.server();

    userFixture = userFixture || `${user}User.json`;
    jwtFixture = jwtFixture || `${user}UserJwt.json`;

    cy.fixture(jwtFixture).then(fixture1 => {
      cy.route({
        method: "POST",
        url: "/api/jwt/generate",
        status: 200,
        response: fixture1
      });
    });

    cy.fixture(userFixture).then(fixture2 => {
      cy.route({
        method: "GET",
        url: "/api/user",
        status: 200,
        response: fixture2
      });
    });

    cy.application().then(app => {
      app.$auth.login({
        url: "api/jwt/generate",
        auth: {
          username: user,
          password: password
        },
        rememberMe: false
      });
    });

    cy.visit(redirectPath);
  }
);
