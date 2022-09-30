import { createPageTitle } from './create-page-title';

describe('Utils', () => {
	describe('createPageUtils()', () => {
		it('Should return a default title', () => {
			const pageTitle = createPageTitle();

			expect(pageTitle).toBe('bezoekertool ***');
		});

		it('Should return a title based on a given param', () => {
			const page = 'About';
			const pageTitle = createPageTitle(page);

			expect(pageTitle).toBe(`${page} | bezoekertool ***`);
		});

		it('Should return a title based on a given param', () => {
			const page =
				'A very long title with Lorem ipsum dolor sit amet, consectetur adipiscing elit';
			const pageTitle = createPageTitle(page);

			expect(pageTitle).toBe(
				`A very long title with Lorem ipsum dolor sit am... | bezoekertool ***`
			);
		});
	});
});
