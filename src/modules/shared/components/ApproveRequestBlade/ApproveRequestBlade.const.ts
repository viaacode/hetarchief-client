import { date, object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

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
	});
};
