import type {
	HetArchiefIeObjectFile as IeObjectFile,
	HetArchiefIeObjectPage as IeObjectPage,
} from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';
import { mapIeObjectPagesToImageInfos, toHetarchiefIiifHost } from './IiifViewerWrapper.helpers';

// Only mimeType/storedAt/thumbnailUrl drive mapIeObjectPagesToImageInfos, so the rest of the
// (otherwise required) typings fields are irrelevant filler here.
const buildFile = (overrides: Partial<IeObjectFile> = {}): IeObjectFile =>
	({
		mimeType: 'image/jp2',
		storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
		thumbnailUrl: '',
		...overrides,
	}) as IeObjectFile;

const buildPage = (files: IeObjectFile[]): IeObjectPage =>
	({
		representations: [{ files }],
	}) as IeObjectPage;

describe('toHetarchiefIiifHost', () => {
	it('swaps the public host for the authenticated hetarchief one', () => {
		expect(toHetarchiefIiifHost('https://iiif-qas.meemoo.be/image/3/public/page-1.jp2')).toEqual(
			'https://iiif-qas.meemoo.be/image/3/hetarchief/page-1.jp2'
		);
	});

	it('leaves a url with a different host untouched', () => {
		expect(toHetarchiefIiifHost('https://assets.example.com/page-1.jp2')).toEqual(
			'https://assets.example.com/page-1.jp2'
		);
	});
});

describe('mapIeObjectPagesToImageInfos', () => {
	it('resolves imageUrl/thumbnailUrl/altoUrl from a page carrying all three file kinds', () => {
		const page = buildPage([
			buildFile({
				mimeType: 'image/jp2',
				storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
			}),
			buildFile({
				mimeType: 'image/jpeg',
				thumbnailUrl: 'https://assets.example.com/page-1-thumbnail.jpeg',
			}),
			buildFile({ mimeType: 'application/xml', storedAt: 'OR-abc/page-1-alto.xml' }),
		]);

		expect(mapIeObjectPagesToImageInfos([page])).toEqual([
			{
				imageUrl: 'https://iiif-qas.meemoo.be/image/3/hetarchief/page-1.jp2',
				thumbnailUrl: 'https://assets.example.com/page-1-thumbnail.jpeg',
				altoUrl: 'OR-abc/page-1-alto.xml',
			},
		]);
	});

	it('falls back to a storedAt ending in jp2 when no image/jp2 mime type is present (ARC-3156)', () => {
		const page = buildPage([
			buildFile({
				mimeType: undefined,
				storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
			}),
		]);

		expect(mapIeObjectPagesToImageInfos([page])[0].imageUrl).toEqual(
			'https://iiif-qas.meemoo.be/image/3/hetarchief/page-1.jp2'
		);
	});

	it('drops a page with no image file, instead of returning an entry with no imageUrl', () => {
		const pageWithOnlyAlto = buildPage([
			buildFile({ mimeType: 'application/xml', storedAt: 'OR-abc/page-1-alto.xml' }),
		]);

		expect(mapIeObjectPagesToImageInfos([pageWithOnlyAlto])).toEqual([]);
	});

	it('returns an empty list when there are no pages', () => {
		expect(mapIeObjectPagesToImageInfos(undefined)).toEqual([]);
		expect(mapIeObjectPagesToImageInfos([])).toEqual([]);
	});

	it('resolves every page, not just the first', () => {
		const page1 = buildPage([
			buildFile({ storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2' }),
		]);
		const page2 = buildPage([
			buildFile({ storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-2.jp2' }),
		]);

		expect(mapIeObjectPagesToImageInfos([page1, page2]).map((info) => info.imageUrl)).toEqual([
			'https://iiif-qas.meemoo.be/image/3/hetarchief/page-1.jp2',
			'https://iiif-qas.meemoo.be/image/3/hetarchief/page-2.jp2',
		]);
	});
});
