import type { HetArchiefIeObject } from '@viaa/avo2-types';

export interface ProviderIdentifierLinkProps {
	label: string;
	href?: string;
}

export const getIeObjectProviderIdentifierLinkProps = (
	mediaInfo: Pick<HetArchiefIeObject, 'meemooLocalId' | 'providerPurl'>,
	isKiosk: boolean
): ProviderIdentifierLinkProps | null => {
	if (!mediaInfo.meemooLocalId) {
		return null;
	}

	return {
		label: mediaInfo.meemooLocalId,
		href: isKiosk ? undefined : mediaInfo.providerPurl || undefined,
	};
};
