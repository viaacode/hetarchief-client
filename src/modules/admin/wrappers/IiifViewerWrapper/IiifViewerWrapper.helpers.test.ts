import type { IeObjectFile, IeObjectPage } from '@ie-objects/ie-objects.types';
import { describe, expect, it } from 'vitest';
import {
	mapGivenPagesToImageInfos,
	mapIeObjectPagesToImageInfos,
	toHetarchiefIiifHost,
} from './IiifViewerWrapper.helpers';

const buildFile = (overrides: Partial<IeObjectFile> = {}): IeObjectFile =>
	({
		id: 'file-id',
		name: 'file-name',
		mimeType: 'image/jp2',
		storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
		thumbnailUrl: '',
		duration: '',
		edmIsNextInSequence: '',
		createdAt: '',
		...overrides,
	}) as IeObjectFile;

const buildPage = (files: IeObjectFile[]): IeObjectPage =>
	({
		pageNumber: 1,
		representations: [{ files } as IeObjectPage['representations'][0]],
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

describe('mapGivenPagesToImageInfos', () => {
	it('swaps the host on imageUrl and passes thumbnailUrl/altoUrl through', () => {
		expect(
			mapGivenPagesToImageInfos([
				{
					imageUrl: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
					thumbnailUrl: 'https://assets.example.com/page-1-thumbnail.jpeg',
					altoUrl: 'OR-abc/page-1-alto.xml',
				},
			])
		).toEqual([
			{
				imageUrl: 'https://iiif-qas.meemoo.be/image/3/hetarchief/page-1.jp2',
				thumbnailUrl: 'https://assets.example.com/page-1-thumbnail.jpeg',
				altoUrl: 'OR-abc/page-1-alto.xml',
			},
		]);
	});

	it('turns a null thumbnailUrl/altoUrl into undefined, same as the object-detail-page mapping', () => {
		const [result] = mapGivenPagesToImageInfos([
			{
				imageUrl: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
				thumbnailUrl: null,
				altoUrl: null,
			},
		]);

		expect(result.thumbnailUrl).toBeUndefined();
		expect(result.altoUrl).toBeUndefined();
	});

	it('returns an empty list for an empty page list', () => {
		expect(mapGivenPagesToImageInfos([])).toEqual([]);
	});
});

describe('mapIeObjectPagesToImageInfos', () => {
	it('resolves imageUrl/thumbnailUrl/altoUrl from a page carrying all three file kinds', () => {
		const page = buildPage([
			buildFile({
				id: 'image-file',
				mimeType: 'image/jp2',
				storedAt: 'https://iiif-qas.meemoo.be/image/3/public/page-1.jp2',
			}),
			buildFile({
				id: 'thumbnail-file',
				mimeType: 'image/jpeg',
				thumbnailUrl: 'https://assets.example.com/page-1-thumbnail.jpeg',
			}),
			buildFile({
				id: 'alto-file',
				mimeType: 'application/xml',
				storedAt: 'OR-abc/page-1-alto.xml',
			}),
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
				mimeType: null as unknown as string,
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
