import { IE_OBJECT_INTRA_CP_LICENSES } from '@ie-objects/ie-objects.consts';
import { mapDcTermsFormatToSimpleType } from '@ie-objects/utils/map-dc-terms-format-to-simple-type';
import type { MaterialRequest } from '@material-requests/types';
import { SimpleIeObjectType } from '@shared/types/ie-objects';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { intersection } from 'lodash-es';

/**
 * Determines if the given IE object and user qualify for a complex reuse flow from the hermes track
 * @param materialRequest
 * @param user
 */
export function useIsComplexReuseFlow(
	materialRequest: MaterialRequest,
	user: AvoUserCommonUser | null
): { isComplexReuseFlow: boolean; isObjectEssenceAccessibleToUser: boolean } {
	return checkIsComplexReuseFlow(materialRequest, user);
}

/**
 * Determines if the given IE object and user qualify for a complex reuse flow from the hermes track
 * @param materialRequest
 * @param user
 */
export function checkIsComplexReuseFlow(
	materialRequest: MaterialRequest,
	user: AvoUserCommonUser | null
): { isComplexReuseFlow: boolean; isObjectEssenceAccessibleToUser: boolean } {
	const simpleType = mapDcTermsFormatToSimpleType(materialRequest.objectDctermsFormat);
	const isComplexReuseFlow: boolean =
		(simpleType === SimpleIeObjectType.AUDIO || simpleType === SimpleIeObjectType.VIDEO) &&
		!!user?.isKeyUser &&
		intersection(materialRequest.objectLicences, IE_OBJECT_INTRA_CP_LICENSES).length > 0;

	// If we're in the complex reuse flow and have a representation, then we know the user is allowed to see this object
	// If we're in the simple flow, we can check the thumbnail url
	const isObjectEssenceAccessibleToUser: boolean = isComplexReuseFlow
		? !!materialRequest.objectRepresentationId
		: !!materialRequest.objectThumbnailUrl;
	return {
		isComplexReuseFlow,
		isObjectEssenceAccessibleToUser,
	};
}
