import { i18n } from 'next-i18next';
import { boolean, object, SchemaOf, string } from 'yup';

import { RequestAccessFormState } from './RequestAccessBlade.types';

export const REQUEST_ACCESS_FORM_SCHEMA = (): SchemaOf<RequestAccessFormState> =>
	object({
		requestReason: string().required(
			i18n?.t(
				'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag-is-een-verplicht-veld'
			)
		),
		visitTime: string().defined(),
		acceptTerms: boolean().required(
			i18n?.t(
				'modules/home/components/request-access-blade/request-access-blade___termen-accepteren-is-verplicht'
			)
		),
	});
