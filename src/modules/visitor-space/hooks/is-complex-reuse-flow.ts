import { selectCommonUser } from '@auth/store/user';
import { IE_OBJECT_INTRA_CP_LICENSES } from '@ie-objects/ie-objects.consts';
import type { MaterialRequest } from '@material-requests/types';
import { isAudioVideoType } from '@meemoo/admin-core-ui/admin';
import getConfig from '@shared/config/public-runtime-config';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { intersection } from 'es-toolkit/compat';
import { useSelector } from 'react-redux';

const { publicRuntimeConfig } = getConfig();

/**
 * Determines if the given IE object and user qualify for a complex reuse flow from the hermes track
 * @param materialRequest
 */
export function useIsComplexReuseFlow(materialRequest: MaterialRequest | undefined): {
	isComplexReuseFlow: boolean;
	isObjectEssenceAccessibleToUser: boolean;
} {
	const commonUser = useSelector(selectCommonUser);
	return checkIsComplexReuseFlow(materialRequest, commonUser);
}

export function isComplexReuseFlowEnabled() {
	return publicRuntimeConfig.ENABLE_MATERIAL_REQUEST_COMPLEX_REUSE_FLOW === 'true';
}

export function isComplexReuseFlowDisabledForMaintainer(maintainerId: string = '') {
	if (!maintainerId) {
		return false;
	}

	const disabledOrganisations: string[] = (
		publicRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS || ''
	)
		.split(',')
		.map((orId: string) => orId.trim())
		.filter((orId: string) => !!orId);
	return disabledOrganisations.includes(maintainerId);
}

export function useIsComplexReuseFlowUser(user: AvoUserCommonUser | null) {
	const isKeyUser: boolean = user?.isKeyUser || false;
	return isKeyUser && isComplexReuseFlowEnabled();
}

/**
 * Determines if the given IE object and user qualify for a complex reuse flow from the hermes track
 * @param materialRequest
 * @param user
 */
export function checkIsComplexReuseFlow(
	materialRequest: MaterialRequest | undefined,
	user: AvoUserCommonUser | null
): { isComplexReuseFlow: boolean; isObjectEssenceAccessibleToUser: boolean } {
	if (!materialRequest) {
		return {
			isComplexReuseFlow: false,
			isObjectEssenceAccessibleToUser: false,
		};
	}

	if (
		!isComplexReuseFlowEnabled() ||
		isComplexReuseFlowDisabledForMaintainer(materialRequest?.maintainerId)
	) {
		return {
			isComplexReuseFlow: false,
			isObjectEssenceAccessibleToUser: !!materialRequest?.objectHasAccessToEssence,
		};
	}

	const isComplexReuseFlow: boolean =
		isAudioVideoType(materialRequest?.objectDctermsFormat) &&
		!!user?.isKeyUser &&
		intersection(materialRequest?.objectLicences || [], IE_OBJECT_INTRA_CP_LICENSES).length > 0;

	// If we're in the complex reuse flow and have a representation, then we know the user is allowed to see this object
	// If we're in the simple flow, the proxy tells us directly whether the essence is accessible
	const isObjectEssenceAccessibleToUser: boolean = isComplexReuseFlow
		? !!materialRequest?.objectRepresentationId
		: !!materialRequest?.objectHasAccessToEssence;
	return {
		isComplexReuseFlow,
		isObjectEssenceAccessibleToUser,
	};
}
