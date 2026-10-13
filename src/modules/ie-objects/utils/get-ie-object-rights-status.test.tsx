import { render } from '@testing-library/react';

import '@testing-library/jest-dom';
import {
	type HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';

import { getIeObjectRightsStatusInfo } from './get-ie-object-rights-status';

vi.mock('@shared/helpers/translate', () => ({ tText: (key: string) => key }));

describe('getIeObjectRightsStatusInfo', () => {
	const getIeObject = (overrides: Partial<HetArchiefIeObject> = {}): HetArchiefIeObject =>
		({
			dctermsFormat: HetArchiefIeObjectType.NEWSPAPER,
			licenses: [],
			...overrides,
		}) as unknown as HetArchiefIeObject;

	it('returns the public domain status for public newspapers in the public domain', () => {
		const info = getIeObjectRightsStatusInfo(
			getIeObject({
				licenses: [
					HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
					HetArchiefIeObjectLicense.PUBLIC_DOMAIN,
				],
			})
		);

		expect(info?.label).toBe(
			'modules/ie-objects/utils/get-ie-object-rights-status___public-domein'
		);
		expect(info?.externalLink).toBe(
			'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-external-link'
		);
		expect(info?.internalLink).toBe(
			'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-internal-link'
		);
		expect(render(<>{info?.icon}</>).container).toHaveTextContent('copyright-public-domain');
	});

	it('returns the undetermined status for public newspapers with undetermined copyright', () => {
		const info = getIeObjectRightsStatusInfo(
			getIeObject({
				licenses: [
					HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
					HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED,
				],
			})
		);

		expect(info?.label).toBe(
			'modules/ie-objects/utils/get-ie-object-rights-status___copyright-undetermined'
		);
		expect(render(<>{info?.icon}</>).container).toHaveTextContent('copyright-undetermined');
	});

	it('prefers the public domain status when both licenses are present', () => {
		const info = getIeObjectRightsStatusInfo(
			getIeObject({
				licenses: [
					HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
					HetArchiefIeObjectLicense.PUBLIC_DOMAIN,
					HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED,
				],
			})
		);

		expect(info?.label).toBe(
			'modules/ie-objects/utils/get-ie-object-rights-status___public-domein'
		);
	});

	it('returns nothing for newspapers without public content', () => {
		expect(
			getIeObjectRightsStatusInfo(
				getIeObject({ licenses: [HetArchiefIeObjectLicense.PUBLIC_DOMAIN] })
			)
		).toBeNull();
	});

	it('returns nothing for public newspapers without a rights license', () => {
		expect(
			getIeObjectRightsStatusInfo(
				getIeObject({ licenses: [HetArchiefIeObjectLicense.PUBLIEK_CONTENT] })
			)
		).toBeNull();
	});

	it.each([
		HetArchiefIeObjectType.VIDEO,
		HetArchiefIeObjectType.AUDIO,
		HetArchiefIeObjectType.FILM,
	])('returns nothing for %s objects, even with public content in the public domain', (type) => {
		expect(
			getIeObjectRightsStatusInfo(
				getIeObject({
					dctermsFormat: type,
					licenses: [
						HetArchiefIeObjectLicense.PUBLIEK_CONTENT,
						HetArchiefIeObjectLicense.PUBLIC_DOMAIN,
					],
				})
			)
		).toBeNull();
	});
});
