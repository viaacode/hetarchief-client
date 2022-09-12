import { date, object, SchemaOf, string } from 'yup';

import { TranslationService } from '@shared/services/translation-service/translation-service';

import { ApproveRequestFormState } from './ApproveRequestBlade.types';

export const APPROVE_REQUEST_FORM_SCHEMA = (): SchemaOf<ApproveRequestFormState> => {
	return object({
		accessFrom: date().required(
			TranslationService.t(
				'modules/cp/components/approve-request-blade/approve-request-blade___een-startdatum-is-verplicht'
			)
		),
		accessTo: date().required(
			TranslationService.t(
				'modules/cp/components/approve-request-blade/approve-request-blade___een-einddatum-is-verplicht'
			)
		),
		accessRemark: string().optional(),
	});
};
