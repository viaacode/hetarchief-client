import type { User } from '@auth/types';
import { type IeObject, IsPartOfKey } from '@ie-objects/ie-objects.types';

/**
 * If the maintainer of this ie-object has an external form for material requests, we need to construct that url with certain parameters
 * This currently is only the case for UGent and VRT
 */
export function getExternalMaterialRequestUrlIfAvailable(
	mediaInfo: IeObject | null | undefined,
	isAnonymous: boolean,
	user: User | null
): string | null {
	if (isAnonymous) {
		return null;
	}

	if (mediaInfo?.maintainerFormUrl && user) {
		// Sometimes we want to encode the url params and sometimes we dont. https://meemoo.atlassian.net/browse/ARC-1710
		// For UGent the whole url is inside one param, so we cannot encode it
		// For vrt the url is stored in the form_url and the params should be encoded
		const encodeOrNotUriComponent = mediaInfo.maintainerFormUrl.startsWith('http')
			? encodeURIComponent
			: (param: string) => param;
		return mediaInfo.maintainerFormUrl
			.replaceAll('{first_name}', encodeOrNotUriComponent(user.firstName))
			.replaceAll('{last_name}', encodeOrNotUriComponent(user.lastName))
			.replaceAll('{email}', encodeOrNotUriComponent(user.email))
			.replaceAll('{local_cp_id}', encodeOrNotUriComponent(mediaInfo?.meemooLocalId || ''))
			.replaceAll('{pid}', encodeOrNotUriComponent(mediaInfo?.schemaIdentifier || ''))
			.replaceAll('{title}', encodeOrNotUriComponent(mediaInfo?.name || ''))
			.replaceAll(
				'{title_serie}',
				encodeOrNotUriComponent(
					mediaInfo?.isPartOf?.find(
						(isPartOfEntry) => isPartOfEntry?.collectionType === IsPartOfKey.series
					)?.name || ''
				)
			);
	}
	return null;
}
