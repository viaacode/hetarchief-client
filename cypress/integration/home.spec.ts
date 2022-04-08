describe('Page: Home', () => {
	beforeEach(() => {
		cy.visit('/');
	});

	it('Should link to reading room detail', () => {
		cy.get('a[href^="/or-123"]').click();
		cy.location('pathname').should('contain', '/or-123');
	});
});
