import { isEmpty } from 'lodash-es';
import { array, date, mixed, object, ref, type SchemaOf, string } from 'yup';

import { type ApproveRequestFormState } from '@shared/components/ApproveRequestBlade/ApproveRequestBlade.types';
import { tText } from '@shared/helpers/translate';
import { AccessType } from '@shared/types';

export const APPROVE_REQUEST_FORM_SCHEMA = (): SchemaOf<ApproveRequestFormState> => {
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
			type: mixed<AccessType>()
				.oneOf(Object.values(AccessType))
				.required(
					tText(
						'modules/cp/components/approve-request-blade/approve-request-blade___selecteren-van-een-toegangsmachtiging-is-verplicht'
					)
				),
			folderIds: array(string().required()).test(
				'folders-conditional',
				tText(
					'modules/cp/components/approve-request-blade/approve-request-blade___selecteren-van-folders-is-verplicht'
				),
				(valueOfFolderIds, testContext) => {
					const type = testContext.parent.type;

					if (type === AccessType.FULL) {
						return true;
					}

					if (type === AccessType.FOLDERS) {
						return !isEmpty(valueOfFolderIds);
					}

					return false;
				}
			),
		}).required(),
	});
};
