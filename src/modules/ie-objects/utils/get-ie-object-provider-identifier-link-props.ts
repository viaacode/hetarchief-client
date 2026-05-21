import type { IeObject } from '@ie-objects/ie-objects.types';

export interface ProviderIdentifierLinkProps {
	label: string;
	href?: string;
}

export const getIeObjectProviderIdentifierLinkProps = (
	mediaInfo: Pick<IeObject, 'meemooLocalId' | 'providerPurl'>,
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
