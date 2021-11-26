describe('Page: Example', () => {
	beforeEach(() => {
		cy.visit('/example');
	});

	it('Should link back to home', () => {
		cy.get('a[href="/"]').click();
		cy.location('pathname').should('eq', '/');
	});
});
