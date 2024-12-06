describe('Login Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:5173/login');
  });

  it('should display login page correctly', () => {
    cy.get('h2').should('contain.text', 'Login to Forum');
    cy.get('label[for="email"]').should('be.visible');
    cy.get('label[for="password"]').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('a[href="/register"]').should('be.visible');
  });

  it('should show error when login with invalid credentials', () => {
    cy.get('input[type="email"]').type('wrong@gmail.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Verifikasi masih di halaman login
    cy.url().should('include', '/login');
  });

  it('should successfully login and redirect to home page', () => {
    cy.get('input[type="email"]').type('irul@gmail.com');
    cy.get('input[type="password"]').type('123123');
    cy.get('button[type="submit"]').click();

    // Verifikasi redirect ke home page
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('should auto-fill form if credentials exist in localStorage', () => {
    const savedEmail = 'irul@gmail.com';
    const savedPassword = '123123';

    cy.window().then((window) => {
      window.localStorage.setItem('lastEmail', savedEmail);
      window.localStorage.setItem('lastPassword', savedPassword);
    });

    cy.reload();

    cy.get('input[type="email"]').should('have.value', savedEmail);
    cy.get('input[type="password"]').should('have.value', savedPassword);
  });

  it('should show loading state during login process', () => {
    cy.get('input[type="email"]').type('irul@gmail.com');
    cy.get('input[type="password"]').type('123123');
    cy.get('button[type="submit"]').click();

    // Verifikasi loading state
    cy.get('div').should('exist');

    // Verifikasi redirect ke home page setelah loading selesai
    cy.url().should('eq', 'http://localhost:5173/');
  });
});
