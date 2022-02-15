import { i18n } from 'next-i18next';
import { object, SchemaOf, string } from 'yup';

import { DeclineRequestFormState } from './DeclineRequestBlade.types';

export const DECLINE_REQUEST_FORM_SCHEMA = (): SchemaOf<DeclineRequestFormState> => {
	return object({
		reasonForDenial: string().required(
			i18n?.t(
				'modules/cp/components/decline-request-blade/decline-request-blade___een-reden-voor-afkeuring-is-verplicht'
			)
		),
	});
};
