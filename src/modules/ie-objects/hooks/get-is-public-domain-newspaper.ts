import { IeObjectType } from '@shared/types/ie-objects';

import { type IeObject, IeObjectLicense } from './../ie-objects.types';

export const useIsPublicDomainNewspaper = (mediaInfo: IeObject | null | undefined): boolean => {
	if (!mediaInfo) {
		return false;
	}
	const hasPublicLicense = !!mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIEK_CONTENT);
	const hasPublicCopyright = !!mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIC_DOMAIN);
	return (
		hasPublicLicense && hasPublicCopyright && mediaInfo.dctermsFormat === IeObjectType.Newspaper
	);
};
