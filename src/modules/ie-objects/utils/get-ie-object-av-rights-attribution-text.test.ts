import { IeObjectType } from '@shared/types/ie-objects';
import { type HetArchiefIeObject, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { describe, expect, it } from 'vitest';

import {
	type AvRightsAttributionTranslations,
	formatAvRightsAttributionNames,
	getIeObjectAvRightsAttributionText,
} from './get-ie-object-av-rights-attribution-text';

const baseIeObject = {
	copyrightHolder: undefined,
	creator: undefined,
	dateCreated: '2023-01-02',
	datePublished: '2023',
	dctermsFormat: IeObjectType.VIDEO,
	licenses: [HetArchiefIeObjectLicense.INTRA_CP_CONTENT],
	maintainerName: 'VRT',
	name: 'Het Huis',
	rightsInfo: {
		reuseCategoryLabel: 'Auteursrechtelijk beschermd',
		reuseLabel: '© VRT',
	},
} as HetArchiefIeObject;

const nlTranslations: AvRightsAttributionTranslations = {
	unknownCreator: 'Onbekende maker',
	missingRightsInfo: 'geen rechteninformatie beschikbaar',
	and: 'en',
	etAl: 'e.a.',
};

const enTranslations: AvRightsAttributionTranslations = {
	unknownCreator: 'Unknown creator',
	missingRightsInfo: 'no rights information available',
	and: 'and',
	etAl: 'et al.',
};

describe('getIeObjectAvRightsAttributionText', () => {
	it('uses the copyright holder before maker, producer and maintainer', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					copyrightHolder: 'Panenka',
					creator: {
						Maker: ['Maker A'],
						productionCompany: ['Producer A'],
					},
				},
				nlTranslations
			)
		).toBe('Panenka, Het Huis, 2023-01-02, VRT, Auteursrechtelijk beschermd, hetarchief.be');
	});

	it('falls back to maker values before producer values', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					creator: {
						Maker: ['Dans La Pluie', 'MIAT'],
						productionCompany: ['Producer A'],
					},
				},
				nlTranslations,
				'CC-NC'
			)
		).toBe('Dans La Pluie en MIAT, Het Huis, 2023-01-02, VRT, CC-NC, hetarchief.be');
	});

	it('falls back to producer values before maintainer values', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					creator: {
						productionCompany: ['Roses Are Blue'],
					},
				},
				nlTranslations
			)
		).toBe('Roses Are Blue, Het Huis, 2023-01-02, VRT, Auteursrechtelijk beschermd, hetarchief.be');
	});

	it('falls back to the maintainer as broadcasting organisation', () => {
		expect(getIeObjectAvRightsAttributionText(baseIeObject, nlTranslations)).toBe(
			'VRT, Het Huis, 2023-01-02, VRT, Auteursrechtelijk beschermd, hetarchief.be'
		);
	});

	it('falls back to an unknown creator label in Dutch and English', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					maintainerName: '',
				},
				nlTranslations
			)
		).toContain('Onbekende maker');
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					maintainerName: '',
				},
				enTranslations
			)
		).toContain('Unknown creator');
	});

	it('formats two, three and more than three names', () => {
		expect(formatAvRightsAttributionNames(['A', 'B'], nlTranslations)).toBe('A en B');
		expect(formatAvRightsAttributionNames(['A', 'B', 'C'], nlTranslations)).toBe('A, B en C');
		expect(formatAvRightsAttributionNames(['A', 'B', 'C', 'D'], nlTranslations)).toBe(
			'A, B, C, e.a.'
		);
		expect(formatAvRightsAttributionNames(['A', 'B'], enTranslations)).toBe('A and B');
	});

	it('uses a translated fallback when rights info is missing', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					rightsInfo: undefined,
				},
				nlTranslations,
				null
			)
		).toBe('VRT, Het Huis, 2023-01-02, VRT, geen rechteninformatie beschikbaar, hetarchief.be');
	});
});
