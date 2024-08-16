import { array, date, mixed, object, ref, type Schema, string } from 'yup';

import { type ApproveRequestFormState } from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.types';
import { tText } from '@shared/helpers/translate';
import { AccessType } from '@shared/types/visit-request';

export const APPROVE_REQUEST_FORM_SCHEMA = (): Schema<ApproveRequestFormState> => {
	return object({
		accessFrom: date()
			.nullable()
			.required(
				tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___een-startdatum-is-verplicht'
				)
			),
		accessTo: date()
			.nullable()
			.min(
				ref('accessFrom'),
				tText(
					'modules/shared/components/approve-request-blade/approve-request-blade___de-tot-datum-moet-groter-zijn-dan-de-vanaf-datum'
				)
			)
			.required(
				tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___een-einddatum-is-verplicht'
				)
			),
		accessRemark: string().optional(),
		accessType: object({
			type: string()
				.oneOf([AccessType.FULL, AccessType.FOLDERS] as const)
				.required(
					tText(
						'modules/cp/components/approve-request-blade/approve-request-blade___selecteren-van-een-toegangsmachtiging-is-verplicht'
					)
				),
			folderIds: mixed().when('type', ([value]) => {
				if ((value as string) === AccessType.FOLDERS) {
					return array()
						.of(string().required())
						.required('Selecting folders is required when access type is FOLDERS');
				} else {
					return array().of(string().required()).optional();
				}
			}),
		}).required(),
	}) as Schema<ApproveRequestFormState>;
};
