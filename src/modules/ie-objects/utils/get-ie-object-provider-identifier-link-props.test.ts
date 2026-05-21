import { getIeObjectProviderIdentifierLinkProps } from './get-ie-object-provider-identifier-link-props';

import { describe, expect, it } from 'vitest';

describe('getIeObjectProviderIdentifierLinkProps', () => {
	it('returns a link target for non-kiosk users when a provider pURI is available', () => {
		expect(
			getIeObjectProviderIdentifierLinkProps(
				{
					meemooLocalId: 'ARC-3650',
					providerPurl: 'https://provider.example/object/ARC-3650',
				},
				false
			)
		).toEqual({
			label: 'ARC-3650',
			href: 'https://provider.example/object/ARC-3650',
		});
	});

	it('keeps the provider identifier as plain text when no provider pURI is available', () => {
		expect(
			getIeObjectProviderIdentifierLinkProps(
				{
					meemooLocalId: 'ARC-3650',
					providerPurl: null,
				},
				false
			)
		).toEqual({
			label: 'ARC-3650',
			href: undefined,
		});
	});

	it('keeps the provider identifier as plain text for kiosk users', () => {
		expect(
			getIeObjectProviderIdentifierLinkProps(
				{
					meemooLocalId: 'ARC-3650',
					providerPurl: 'https://provider.example/object/ARC-3650',
				},
				true
			)
		).toEqual({
			label: 'ARC-3650',
			href: undefined,
		});
	});
});
