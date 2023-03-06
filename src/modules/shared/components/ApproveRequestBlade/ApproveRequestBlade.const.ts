import { isEmpty } from 'lodash';
import { array, date, mixed, object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';
import { AccessType } from '@shared/types';

import { ApproveRequestFormState } from './ApproveRequestBlade.types';

export const APPROVE_REQUEST_FORM_SCHEMA = (): SchemaOf<ApproveRequestFormState> => {
	return object({
		accessFrom: date().required(
			tText(
				'modules/cp/components/approve-request-blade/approve-request-blade___een-startdatum-is-verplicht'
			)
		),
		accessTo: date().required(
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
