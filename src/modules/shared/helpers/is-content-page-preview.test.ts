import { isContentPagePreview } from '@shared/helpers/is-content-page-preview';
import { afterEach, describe, expect, it } from 'vitest';

const originalLocation = window.location;

const setUrl = (url: string) => {
	Object.defineProperty(window, 'location', {
		configurable: true,
		writable: true,
		value: new URL(url) as unknown as Location,
	});
};

afterEach(() => {
	Object.defineProperty(window, 'location', {
		configurable: true,
		writable: true,
		value: originalLocation,
	});
});

describe('isContentPagePreview()', () => {
	it('recognises a public content page as not being a preview', () => {
		setUrl('https://hetarchief.be/');
		expect(isContentPagePreview()).toBe(false);

		setUrl('https://hetarchief.be/een-content-pagina');
		expect(isContentPagePreview()).toBe(false);

		setUrl('https://hetarchief.be/zoeken?format=video');
		expect(isContentPagePreview()).toBe(false);
	});

	it('recognises the preview query param', () => {
		setUrl('https://hetarchief.be/een-content-pagina?preview=true');
		expect(isContentPagePreview()).toBe(true);
	});

	it('recognises the content page editor and detail view, in every locale', () => {
		// nl
		setUrl('https://hetarchief.be/admin/content-paginas/123/bewerk');
		expect(isContentPagePreview()).toBe(true);

		setUrl('https://hetarchief.be/admin/content-paginas/123');
		expect(isContentPagePreview()).toBe(true);

		// en
		setUrl('https://hetarchief.be/admin/content-pages/123/edit');
		expect(isContentPagePreview()).toBe(true);

		setUrl('https://hetarchief.be/admin/content-pages/create');
		expect(isContentPagePreview()).toBe(true);
	});

	it('does not mistake a public page whose slug merely starts with the admin prefix', () => {
		setUrl('https://hetarchief.be/administratie');
		expect(isContentPagePreview()).toBe(false);
	});
});
