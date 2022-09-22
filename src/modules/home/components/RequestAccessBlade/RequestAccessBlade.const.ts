import { boolean, object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { RequestAccessFormState } from './RequestAccessBlade.types';

export const REQUEST_ACCESS_FORM_SCHEMA = (): SchemaOf<RequestAccessFormState> =>
	object({
		requestReason: string().required(
			tText(
				'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag-is-een-verplicht-veld'
			)
		),
		visitTime: string().optional(),
		acceptTerms: boolean()
			.required(
				tText(
					'modules/home/components/request-access-blade/request-access-blade___termen-accepteren-is-verplicht'
				)
			)

			.oneOf(
				[true],
				tText(
					'modules/home/components/request-access-blade/request-access-blade___termen-accepteren-is-verplicht'
				)
			),
	});
