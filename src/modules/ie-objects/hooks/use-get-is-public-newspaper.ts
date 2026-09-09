import { isNewspaperType } from '@meemoo/admin-core-ui/admin';
import { type HetArchiefIeObject, HetArchiefIeObjectLicense } from '@viaa/avo2-types';

export const useIsPublicNewspaper = (mediaInfo: HetArchiefIeObject | null | undefined): boolean => {
	if (!mediaInfo) {
		return false;
	}
	const hasPublicLicense = mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.PUBLIEK_CONTENT);
	const hasPublicCopyright =
		mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.PUBLIC_DOMAIN) ||
		mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED);
	return hasPublicLicense && hasPublicCopyright && isNewspaperType(mediaInfo.dctermsFormat);
};
