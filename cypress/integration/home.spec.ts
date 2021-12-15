describe('Page: Home', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should link to reading room detail', () => {
		cy.get('a[href^="/leeszaal"]').click();
		cy.location('pathname').should('eq', '/');
	});
});
