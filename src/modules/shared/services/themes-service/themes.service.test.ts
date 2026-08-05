import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockJson = vi.fn().mockResolvedValue({ items: [], total: 0, pages: 0, page: 0, size: 20 });
const mockGet = vi.fn().mockReturnValue({ json: mockJson });
const mockPost = vi.fn().mockReturnValue({ json: mockJson });
const mockPatch = vi.fn().mockReturnValue({ json: mockJson });
const mockDelete = vi.fn().mockResolvedValue(undefined);

vi.mock('@shared/services/api-service', () => ({
	ApiService: {
		getApi: () => ({ get: mockGet, post: mockPost, patch: mockPatch, delete: mockDelete }),
	},
}));

import { ThemesService } from './themes.service';
import { ThemeOrderProp } from './themes.types';

const requestedUrl = (): string => mockGet.mock.calls[0][0] as string;

/** Turn the FormData of the last post/patch call into a plain object for assertions */
const sentFormData = (mock: typeof mockPost): Record<string, unknown> => {
	const body = mock.mock.calls[0][1].body as FormData;
	return Object.fromEntries(body.entries());
};

const sentHeaders = (mock: typeof mockPost): Record<string, unknown> =>
	mock.mock.calls[0][1].headers as Record<string, unknown>;

describe('ThemesService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGet.mockReturnValue({ json: mockJson });
		mockPost.mockReturnValue({ json: mockJson });
		mockPatch.mockReturnValue({ json: mockJson });
	});

	describe('getAll()', () => {
		it('requests the themes endpoint', async () => {
			await ThemesService.getAll({});

			expect(requestedUrl()).toEqual('themes');
		});

		it('maps search to the searchTerm query param', async () => {
			await ThemesService.getAll({ search: 'onderwijs' });

			expect(requestedUrl()).toContain('searchTerm=onderwijs');
		});

		it('trims the search term', async () => {
			await ThemesService.getAll({ search: '  onderwijs  ' });

			expect(requestedUrl()).toContain('searchTerm=onderwijs');
		});

		it('omits searchTerm when the search is empty or whitespace only', async () => {
			await ThemesService.getAll({ search: '   ' });

			expect(requestedUrl()).not.toContain('searchTerm');
		});

		it('passes pagination and sorting params', async () => {
			await ThemesService.getAll({
				page: 2,
				size: 20,
				orderProp: ThemeOrderProp.updatedAt,
				orderDirection: AvoSearchOrderDirection.DESC,
			});

			const url = requestedUrl();
			expect(url).toContain('page=2');
			expect(url).toContain('size=20');
			expect(url).toContain('orderProp=updatedAt');
			expect(url).toContain('orderDirection=desc');
		});
	});

	describe('delete()', () => {
		it('deletes the theme by id', async () => {
			await ThemesService.delete('theme-uuid-1');

			expect(mockDelete).toHaveBeenCalledWith('themes/theme-uuid-1');
		});
	});

	describe('create()', () => {
		it('posts multipart to the themes endpoint', async () => {
			await ThemesService.create({ slug: 'pukkelpop', nameNl: 'Pukkelpop', nameEn: 'Pukkelpop' });

			expect(mockPost.mock.calls[0][0]).toEqual('themes');
			// Content-Type must be cleared so the browser can set the multipart boundary
			expect(sentHeaders(mockPost)).toEqual({ 'Content-Type': undefined });
		});

		it('sends every provided text field', async () => {
			await ThemesService.create({
				slug: 'pukkelpop',
				nameNl: 'Pukkelpop',
				nameEn: 'Pukkelpop',
				descriptionNl: 'Festival',
				descriptionEn: 'Festival',
				contentPagePathNl: '/themas/pukkelpop',
				contentPagePathEn: '/themes/pukkelpop',
			});

			expect(sentFormData(mockPost)).toEqual({
				slug: 'pukkelpop',
				nameNl: 'Pukkelpop',
				nameEn: 'Pukkelpop',
				descriptionNl: 'Festival',
				descriptionEn: 'Festival',
				contentPagePathNl: '/themas/pukkelpop',
				contentPagePathEn: '/themes/pukkelpop',
			});
		});

		it('sends empty strings, so a description or path can be cleared', async () => {
			await ThemesService.create({ slug: 'x', descriptionNl: '', contentPagePathNl: '' });

			expect(sentFormData(mockPost)).toEqual({
				slug: 'x',
				descriptionNl: '',
				contentPagePathNl: '',
			});
		});

		it('omits fields that are undefined or null', async () => {
			await ThemesService.create({ slug: 'x', descriptionNl: null, nameNl: undefined });

			expect(sentFormData(mockPost)).toEqual({ slug: 'x' });
		});

		it('appends the picked file, and does not also send imageUrl', async () => {
			const file = new File([new Uint8Array(4)], 'thumb.png', { type: 'image/png' });

			await ThemesService.create({ slug: 'x', file, imageUrl: 'blob:http://localhost/abc' });

			const sent = sentFormData(mockPost);
			expect(sent.file).toBeInstanceOf(File);
			// The proxy uploads the file and sets imageUrl itself
			expect(sent).not.toHaveProperty('imageUrl');
		});
	});

	describe('update()', () => {
		it('patches multipart to the theme by id', async () => {
			await ThemesService.update('theme-uuid-1', { nameNl: 'Nieuwe naam' });

			expect(mockPatch.mock.calls[0][0]).toEqual('themes/theme-uuid-1');
			expect(sentFormData(mockPatch)).toEqual({ nameNl: 'Nieuwe naam' });
			expect(sentHeaders(mockPatch)).toEqual({ 'Content-Type': undefined });
		});

		it('can replace the thumbnail', async () => {
			const file = new File([new Uint8Array(4)], 'thumb.png', { type: 'image/png' });

			await ThemesService.update('theme-uuid-1', { file });

			expect(sentFormData(mockPatch).file).toBeInstanceOf(File);
		});
	});

	describe('getWithIeObjects()', () => {
		it('requests the theme and its linked objects in one call', async () => {
			await ThemesService.getWithIeObjects({ themeId: 'theme-uuid-1', page: 2, size: 20 });

			const url = requestedUrl();
			expect(url).toContain('themes/theme-uuid-1/ie-objects');
			expect(url).toContain('page=2');
			expect(url).toContain('size=20');
		});
	});

	describe('addIeObjects()', () => {
		it('posts the schema identifiers as json', async () => {
			await ThemesService.addIeObjects('theme-uuid-1', ['qsnk362q84', 'qs2r3nwr0b']);

			expect(mockPost.mock.calls[0][0]).toEqual('themes/theme-uuid-1/ie-objects');
			expect(mockPost.mock.calls[0][1]).toEqual({
				json: { ieObjectSchemaIdentifiers: ['qsnk362q84', 'qs2r3nwr0b'] },
			});
		});
	});

	describe('deleteIeObject()', () => {
		it('deletes by schema identifier, never by entity uri', async () => {
			await ThemesService.deleteIeObject('theme-uuid-1', 'qsnk362q84');

			expect(mockDelete).toHaveBeenCalledWith('themes/theme-uuid-1/ie-objects/qsnk362q84');
		});
	});
});
