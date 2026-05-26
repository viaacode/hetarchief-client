import { IeObjectLicense, type IeObject } from '@ie-objects/ie-objects.types';
import { IeObjectType } from '@shared/types/ie-objects';
import { Locale } from '@shared/utils/i18n';
import { describe, expect, it } from 'vitest';

import {
	formatAvRightsAttributionNames,
	getIeObjectAvRightsAttributionText,
} from './get-ie-object-av-rights-attribution-text';

const baseIeObject = {
	copyrightHolder: undefined,
	creator: undefined,
	dateCreated: '2023-01-02',
	datePublished: '2023',
	dctermsFormat: IeObjectType.VIDEO,
	licenses: [IeObjectLicense.INTRA_CP_CONTENT],
	maintainerName: 'VRT',
	name: 'Het Huis',
	rightsInfo: {
		reuseCategoryLabel: 'Auteursrechtelijk beschermd',
		reuseLabel: '© VRT',
	},
} as IeObject;

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
				Locale.nl
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
				Locale.nl,
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
				Locale.nl
			)
		).toBe(
			'Roses Are Blue, Het Huis, 2023-01-02, VRT, Auteursrechtelijk beschermd, hetarchief.be'
		);
	});

	it('falls back to the maintainer as broadcasting organisation', () => {
		expect(getIeObjectAvRightsAttributionText(baseIeObject, Locale.nl)).toBe(
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
				Locale.nl
			)
		).toContain('Onbekende maker');
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					maintainerName: '',
				},
				Locale.en
			)
		).toContain('Unknown creator');
	});

	it('formats two, three and more than three names', () => {
		expect(formatAvRightsAttributionNames(['A', 'B'], Locale.nl)).toBe('A en B');
		expect(formatAvRightsAttributionNames(['A', 'B', 'C'], Locale.nl)).toBe('A, B en C');
		expect(formatAvRightsAttributionNames(['A', 'B', 'C', 'D'], Locale.nl)).toBe(
			'A, B, C, e.a.'
		);
		expect(formatAvRightsAttributionNames(['A', 'B'], Locale.en)).toBe('A and B');
	});

	it('uses a translated fallback when rights info is missing', () => {
		expect(
			getIeObjectAvRightsAttributionText(
				{
					...baseIeObject,
					rightsInfo: undefined,
				},
				Locale.nl,
				null
			)
		).toBe('VRT, Het Huis, 2023-01-02, VRT, geen rechteninformatie beschikbaar, hetarchief.be');
	});
});
