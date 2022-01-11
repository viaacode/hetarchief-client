import { createPageTitle, HET_ARCHIEF_PAGE_TITLE } from './create-page-title';

describe('Utils', () => {
	describe('createPageUtils()', () => {
		it('Should return a default title', () => {
			const pageTitle = createPageTitle();

			expect(pageTitle).toBe(HET_ARCHIEF_PAGE_TITLE);
		});

		it('Should return a title based on a given param', () => {
			const page = 'About';
			const pageTitle = createPageTitle(page);

			expect(pageTitle).toBe(`${page} | ${HET_ARCHIEF_PAGE_TITLE}`);
		});
	});
});
