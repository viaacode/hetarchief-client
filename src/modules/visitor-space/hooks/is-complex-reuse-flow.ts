import { selectCommonUser } from '@auth/store/user';
import { IE_OBJECT_INTRA_CP_LICENSES } from '@ie-objects/ie-objects.consts';
import { mapDcTermsFormatToSimpleType } from '@ie-objects/utils/map-dc-terms-format-to-simple-type';
import type { MaterialRequest } from '@material-requests/types';
import { SimpleIeObjectType } from '@shared/types/ie-objects';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { intersection } from 'lodash-es';
import getConfig from 'next/config';
import { useSelector } from 'react-redux';

const { publicRuntimeConfig } = getConfig();

/**
 * Determines if the given IE object and user qualify for a complex reuse flow from the hermes track
 * @param materialRequest
 */
export function useIsComplexReuseFlow(materialRequest: MaterialRequest): {
	isComplexReuseFlow: boolean;
	isObjectEssenceAccessibleToUser: boolean;
} {
	const commonUser = useSelector(selectCommonUser);
	return checkIsComplexReuseFlow(materialRequest, commonUser);
}

export function useIsComplexReuseFlowUser(user: AvoUserCommonUser | null) {
	const isKeyUser: boolean = user?.isKeyUser || false;
	const isComplexReuseFlowEnabled =
		publicRuntimeConfig.ENABLE_MATERIAL_REQUEST_COMPLEX_REUSE_FLOW === 'true';
	return isKeyUser && isComplexReuseFlowEnabled;
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
	if (!materialRequest) {
		return {
			isComplexReuseFlow: false,
			isObjectEssenceAccessibleToUser: false,
		};
	}
	if (publicRuntimeConfig.ENABLE_MATERIAL_REQUEST_COMPLEX_REUSE_FLOW !== 'true') {
		return {
			isComplexReuseFlow: false,
			isObjectEssenceAccessibleToUser: !!materialRequest?.objectThumbnailUrl,
		};
	}
	const simpleType = mapDcTermsFormatToSimpleType(materialRequest?.objectDctermsFormat);
	const isComplexReuseFlow: boolean =
		(simpleType === SimpleIeObjectType.AUDIO || simpleType === SimpleIeObjectType.VIDEO) &&
		!!user?.isKeyUser &&
		intersection(materialRequest?.objectLicences || [], IE_OBJECT_INTRA_CP_LICENSES).length > 0;

	// If we're in the complex reuse flow and have a representation, then we know the user is allowed to see this object
	// If we're in the simple flow, we can check the thumbnail url
	const isObjectEssenceAccessibleToUser: boolean = isComplexReuseFlow
		? !!materialRequest?.objectRepresentationId
		: !!materialRequest?.objectThumbnailUrl;
	return {
		isComplexReuseFlow,
		isObjectEssenceAccessibleToUser,
	};
}
