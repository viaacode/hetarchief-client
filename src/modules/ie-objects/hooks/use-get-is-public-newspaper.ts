import { IeObjectType } from '@shared/types/ie-objects';

import { type IeObject, IeObjectLicense } from './../ie-objects.types';

export const useIsPublicNewspaper = (mediaInfo: IeObject | null | undefined): boolean => {
	if (!mediaInfo) {
		return false;
	}
	const hasPublicLicense = mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIEK_CONTENT);
	const hasPublicCopyright =
		mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIC_DOMAIN) ||
		mediaInfo?.licenses?.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED);
	return (
		hasPublicLicense && hasPublicCopyright && mediaInfo.dctermsFormat === IeObjectType.Newspaper
	);
};
