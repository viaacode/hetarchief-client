import { boolean, object, SchemaOf, string } from 'yup';

import { TranslationService } from '@shared/services/translation-service/translation-service';

import { RequestAccessFormState } from './RequestAccessBlade.types';

export const REQUEST_ACCESS_FORM_SCHEMA = (): SchemaOf<RequestAccessFormState> =>
	object({
		requestReason: string().required(
			TranslationService.t(
				'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag-is-een-verplicht-veld'
			)
		),
		visitTime: string().optional(),
		acceptTerms: boolean()
			.required(
				TranslationService.t(
					'modules/home/components/request-access-blade/request-access-blade___termen-accepteren-is-verplicht'
				)
			)

			.oneOf(
				[true],
				TranslationService.t(
					'modules/home/components/request-access-blade/request-access-blade___termen-accepteren-is-verplicht'
				)
			),
	});
