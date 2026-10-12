import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import {
	type HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';

import {
	getIeObjectAvRights,
	getIeObjectAvRightsIcon,
	getIeObjectAvRightsLabel,
	getIeObjectAvRightsUrl,
} from './get-ie-object-av-rights';

vi.mock('@shared/helpers/translate', () => {
	const translations: Record<string, string> = {
		'modules/visitor-space/const/rights-filter___cc0': 'CC0',
		'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald':
			'Auteursrechtelijke bescherming niet bepaald',
		'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar':
			'Rechthebbenden niet lokaliseerbaar of niet identificeerbaar',
		'modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd':
			'Auteursrechtelijk beschermd',
	};

	return { tText: (key: string) => translations[key] ?? key };
});

describe('getIeObjectAvRightsIcon', () => {
	it('returns the protected rights statement logo for protected AV rights', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({ reuseLabel: 'auteursrechtelijk beschermd' })
		);

		expect(container).toHaveTextContent('copyright');
	});

	it('returns the protected rights statement logo for individualized attribution labels', () => {
		const { container } = render(getIeObjectAvRightsIcon({ reuseLabel: '© Vlaams Parlement' }));

		expect(container).toHaveTextContent('copyright');
	});

	it('uses the KG label as display label for individualized attribution labels', () => {
		const rightsInfo = {
			reuseLabel: '© Vlaams Parlement',
			reuseCategoryUrl: 'https://rightsstatements.org/page/InC/1.0/',
		};

		expect(getIeObjectAvRightsLabel(rightsInfo)).toBe('© Vlaams Parlement');
		expect(getIeObjectAvRightsUrl(rightsInfo)).toBe('https://rightsstatements.org/page/InC/1.0/');
	});

	it('returns the undetermined icon for unclear or unlocatable AV rights', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({
				reuseLabel: 'rechthebbende niet vindbaar of niet lokaliseerbaar',
				reuseCategoryId: 'https://rightsstatements.org/page/InC-RUU/1.0/?language=nl',
			})
		);

		expect(container).toHaveTextContent('copyright-undetermined');
	});

	it('returns the public domain icon for CC0 AV rights', () => {
		const { container } = render(getIeObjectAvRightsIcon({ reuseLabel: 'CC0' }));

		expect(container).toHaveTextContent('copyright-public-domain');
	});

	it('uses the rights URL lookup for labels and icons', () => {
		const rightsInfo = {
			reuseLabel: 'Creative Commons',
			reuseCategoryUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
		};
		const { container } = render(getIeObjectAvRightsIcon(rightsInfo));

		expect(container).toHaveTextContent('copyright-public-domain');
		expect(getIeObjectAvRightsLabel(rightsInfo)).toBe('CC0');
	});

	it('returns no icon when no rights information is available', () => {
		const { container } = render(
			getIeObjectAvRightsIcon({ reuseLabel: 'geen rechteninformatie beschikbaar' })
		);

		expect(container).toBeEmptyDOMElement();
	});

	it('handles missing rights info in the helper functions', () => {
		const { container } = render(getIeObjectAvRightsIcon(undefined));

		expect(container).toBeEmptyDOMElement();
		expect(getIeObjectAvRightsLabel(undefined)).toBeNull();
		expect(getIeObjectAvRightsUrl(undefined)).toBeUndefined();
	});

	it('detects missing rights info case-insensitively', () => {
		expect(
			getIeObjectAvRightsUrl({ reuseLabel: 'Geen rechteninformatie beschikbaar' })
		).toBeUndefined();
	});
});

describe('getIeObjectAvRights', () => {
	const PLACEHOLDER_LABEL = 'deze informatie wordt verder verzameld';

	const getIeObject = (overrides: Partial<HetArchiefIeObject> = {}): HetArchiefIeObject =>
		({
			dctermsFormat: HetArchiefIeObjectType.VIDEO,
			licenses: [],
			rightsInfo: null,
			...overrides,
		}) as unknown as HetArchiefIeObject;

	it('returns the label, icon and url of the usage label when there is one', () => {
		const rights = getIeObjectAvRights(
			getIeObject({
				licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				rightsInfo: {
					reuseLabel: 'CC0',
					reuseCategoryUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
				},
			})
		);

		expect(rights?.label).toBe('CC0');
		expect(rights?.url).toBe('https://creativecommons.org/publicdomain/zero/1.0/');
		expect(render(<>{rights?.icon}</>).container).toHaveTextContent('copyright-public-domain');
	});

	it.each([
		HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
		HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
		HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
	])('returns the placeholder without icon or url for %s without a usage label', (license) => {
		expect(getIeObjectAvRights(getIeObject({ licenses: [license] }))).toEqual({
			label: PLACEHOLDER_LABEL,
			icon: null,
		});
	});

	it('returns the placeholder when the rights info has no values', () => {
		const rights = getIeObjectAvRights(
			getIeObject({
				licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				rightsInfo: { reuseLabel: '', reuseCategoryUrl: '' },
			})
		);

		expect(rights).toEqual({ label: PLACEHOLDER_LABEL, icon: null });
	});

	it('does not link the placeholder when the rights info only has a url', () => {
		const rights = getIeObjectAvRights(
			getIeObject({
				licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				rightsInfo: { reuseLabel: '', reuseCategoryUrl: 'https://example.org/rights' },
			})
		);

		expect(rights?.label).toBe(PLACEHOLDER_LABEL);
		expect(rights?.url).toBeUndefined();
		expect(rights?.icon).toBeNull();
	});

	it('returns nothing without a usage label or a metadata license', () => {
		expect(getIeObjectAvRights(getIeObject())).toBeNull();
		expect(
			getIeObjectAvRights(
				getIeObject({ licenses: [HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL] })
			)
		).toBeNull();
	});

	it('returns nothing for objects that are not audio or video', () => {
		expect(
			getIeObjectAvRights(
				getIeObject({
					dctermsFormat: HetArchiefIeObjectType.NEWSPAPER,
					licenses: [HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD],
				})
			)
		).toBeNull();
	});
});
