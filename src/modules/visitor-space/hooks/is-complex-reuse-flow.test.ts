import type { MaterialRequest } from '@material-requests/types';
import {
	type AvoUserCommonUser,
	HetArchiefIeObjectLicense,
	HetArchiefIeObjectType,
} from '@viaa/avo2-types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockRuntimeConfig = vi.hoisted(() => ({
	DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS: '',
}));

vi.mock('@shared/config/public-runtime-config', () => ({
	default: () => ({ publicRuntimeConfig: mockRuntimeConfig }),
}));

import {
	checkIsComplexReuseFlow,
	isComplexReuseFlowDisabledForMaintainer,
} from './is-complex-reuse-flow';

const keyUser = { isKeyUser: true } as AvoUserCommonUser;
const normalUser = { isKeyUser: false } as AvoUserCommonUser;

const getMaterialRequest = (overrides: Partial<MaterialRequest> = {}): MaterialRequest =>
	({
		maintainerId: 'OR-complex',
		objectDctermsFormat: HetArchiefIeObjectType.VIDEO,
		objectLicences: [HetArchiefIeObjectLicense.INTRA_CP_CONTENT],
		objectHasAccessToEssence: false,
		objectRepresentationId: 'representation-1',
		...overrides,
	}) as MaterialRequest;

describe('Hooks', () => {
	describe('is-complex-reuse-flow', () => {
		beforeEach(() => {
			mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = '';
		});

		describe('isComplexReuseFlowDisabledForMaintainer', () => {
			it('Should not be disabled when no organisations are configured', () => {
				expect(isComplexReuseFlowDisabledForMaintainer('OR-complex')).toBe(false);
			});

			it('Should not be disabled when the maintainer id is empty or missing', () => {
				mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = 'OR-simple';

				expect(isComplexReuseFlowDisabledForMaintainer('')).toBe(false);
				expect(isComplexReuseFlowDisabledForMaintainer()).toBe(false);
			});

			it('Should be disabled for a configured maintainer', () => {
				mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = 'OR-simple';

				expect(isComplexReuseFlowDisabledForMaintainer('OR-simple')).toBe(true);
				expect(isComplexReuseFlowDisabledForMaintainer('OR-complex')).toBe(false);
			});

			it('Should handle a comma separated list with whitespace and empty entries', () => {
				mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = ' OR-a, OR-b ,,';

				expect(isComplexReuseFlowDisabledForMaintainer('OR-a')).toBe(true);
				expect(isComplexReuseFlowDisabledForMaintainer('OR-b')).toBe(true);
				expect(isComplexReuseFlowDisabledForMaintainer('OR-c')).toBe(false);
			});

			it('Should not match on a partial id', () => {
				mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = 'OR-simple';

				expect(isComplexReuseFlowDisabledForMaintainer('OR-simpl')).toBe(false);
				expect(isComplexReuseFlowDisabledForMaintainer('OR-simple-2')).toBe(false);
			});
		});

		describe('checkIsComplexReuseFlow', () => {
			it('Should return false for both flags without a material request', () => {
				expect(checkIsComplexReuseFlow(undefined, keyUser)).toEqual({
					isComplexReuseFlow: false,
					isObjectEssenceAccessibleToUser: false,
				});
			});

			it('Should use the complex flow for a key user requesting an intra-cp video', () => {
				const result = checkIsComplexReuseFlow(getMaterialRequest(), keyUser);

				expect(result.isComplexReuseFlow).toBe(true);
			});

			it('Should treat the essence as accessible in the complex flow when there is a representation', () => {
				expect(checkIsComplexReuseFlow(getMaterialRequest(), keyUser)).toEqual({
					isComplexReuseFlow: true,
					isObjectEssenceAccessibleToUser: true,
				});
				expect(
					checkIsComplexReuseFlow(
						getMaterialRequest({ objectRepresentationId: undefined }),
						keyUser
					).isObjectEssenceAccessibleToUser
				).toBe(false);
			});

			it('Should not use the complex flow for a user that is not a key user', () => {
				expect(
					checkIsComplexReuseFlow(
						getMaterialRequest({ objectHasAccessToEssence: true }),
						normalUser
					)
				).toEqual({
					isComplexReuseFlow: false,
					isObjectEssenceAccessibleToUser: true,
				});
			});

			it('Should not use the complex flow for a user that is not logged in', () => {
				expect(checkIsComplexReuseFlow(getMaterialRequest(), null).isComplexReuseFlow).toBe(false);
			});

			it('Should not use the complex flow for an object without an intra-cp license', () => {
				const materialRequest = getMaterialRequest({
					objectLicences: [HetArchiefIeObjectLicense.PUBLIEK_CONTENT],
				});

				expect(checkIsComplexReuseFlow(materialRequest, keyUser).isComplexReuseFlow).toBe(false);
			});

			it('Should not use the complex flow for an object that is not audio or video', () => {
				const materialRequest = getMaterialRequest({
					objectDctermsFormat: HetArchiefIeObjectType.IMAGE,
				});

				expect(checkIsComplexReuseFlow(materialRequest, keyUser).isComplexReuseFlow).toBe(false);
			});

			it('Should fall back to the simple flow for a maintainer that has the complex flow disabled', () => {
				mockRuntimeConfig.DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS = 'OR-simple';
				const materialRequest = getMaterialRequest({
					maintainerId: 'OR-simple',
					objectHasAccessToEssence: true,
				});

				expect(checkIsComplexReuseFlow(materialRequest, keyUser)).toEqual({
					isComplexReuseFlow: false,
					isObjectEssenceAccessibleToUser: true,
				});
			});
		});
	});
});
