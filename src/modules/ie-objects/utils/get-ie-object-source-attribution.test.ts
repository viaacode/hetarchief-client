import { IeObjectType } from '@shared/types/ie-objects';
import { Locale } from '@shared/utils/i18n';
import { type HetArchiefIeObject, HetArchiefIeObjectAccessThrough } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

import {
	formatSourceAttributionNames,
	getIeObjectSourceAttribution,
} from './get-ie-object-source-attribution';

const baseObject = {
	dctermsFormat: IeObjectType.VIDEO,
	accessThrough: [HetArchiefIeObjectAccessThrough.PUBLIC_INFO],
	name: 'Het journaal',
	dateCreated: '2026-05-21',
	datePublished: '2026-05-20',
	maintainerName: 'VRT',
	thumbnailUrl: 'https://example.com/thumb.jpg',
	hasAccessToEssence: true,
	rightsInfo: {
		reuseLabel: '© VRT',
		reuseCategoryLabel: 'Auteursrechtelijk beschermd',
	},
} as HetArchiefIeObject;

function createIeObject(overrides: Partial<HetArchiefIeObject>): HetArchiefIeObject {
	return {
		...baseObject,
		...overrides,
	};
}

describe('getIeObjectSourceAttribution', () => {
	it('uses AV creator fallback order', () => {
		expect(
			getIeObjectSourceAttribution({
				...createIeObject({
					copyrightHolder: 'Rechthebbende',
					creator: { maker: ['Maker'], productionCompany: ['Producent'] },
				}),
			})
		).toBe(
			'Rechthebbende, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.'
		);

		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: '',
					creator: { maker: ['Maker'], productionCompany: ['Producent'] },
				})
			)
		).toBe('Maker, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.');

		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: '',
					creator: { productionCompany: ['Producent'] },
				})
			)
		).toBe('Producent, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.');

		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: '',
					creator: {},
					rightsInfo: {
						reuseLabel: '© VRT',
						reuseCategoryLabel: 'Auteursrechtelijk beschermd',
						broadcastingOrganization: 'Omroep',
					},
				})
			)
		).toBe('Omroep, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.');

		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: '',
					creator: {},
				})
			)
		).toBe(
			'Onbekende maker, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.'
		);

		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: '',
					creator: {},
				}),
				Locale.en
			)
		).toBe(
			'Unknown creator, Het journaal, 2026-05-21, VRT, Auteursrechtelijk beschermd, hetarchief.be.'
		);
	});

	it('formats source attribution names according to the FA', () => {
		expect(formatSourceAttributionNames(['A', 'B'])).toBe('A en B');
		expect(formatSourceAttributionNames(['A', 'B', 'C'])).toBe('A, B en C');
		expect(formatSourceAttributionNames(['A', 'B', 'C', 'D'])).toBe('A, B, C, e.a.');
	});

	it('uses the missing rights text when usage category is missing', () => {
		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: 'Maker',
					rightsInfo: {
						reuseLabel: '© VRT',
					},
				})
			)
		).toBe(
			'Maker, Het journaal, 2026-05-21, VRT, geen rechteninformatie beschikbaar, hetarchief.be.'
		);
	});

	it('uses the missing rights text when AV rights info is missing but essence is available', () => {
		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					copyrightHolder: 'Maker',
					rightsInfo: null,
				})
			)
		).toBe(
			'Maker, Het journaal, 2026-05-21, VRT, geen rechteninformatie beschikbaar, hetarchief.be.'
		);
	});

	it('uses the usage category for newspapers', () => {
		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					dctermsFormat: IeObjectType.NEWSPAPER,
					thumbnailUrl: 'https://example.com/thumb.jpg',
					name: 'De krant',
					rightsInfo: {
						reuseLabel: 'old rights label',
						reuseCategoryLabel: 'Publiek domein',
					},
				})
			)
		).toBe('De krant, 2026-05-21, VRT, Publiek domein, hetarchief.be.');
	});

	it('does not return attribution for metadata-only AV', () => {
		expect(
			getIeObjectSourceAttribution(
				createIeObject({
					accessThrough: [HetArchiefIeObjectAccessThrough.PUBLIC_INFO],
					rightsInfo: null,
					hasAccessToEssence: false,
				})
			)
		).toBeNull();
	});
});
