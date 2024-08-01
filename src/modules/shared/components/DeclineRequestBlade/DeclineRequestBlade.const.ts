import { object, type Schema, string } from 'yup';

import { type DeclineRequestFormState } from './DeclineRequestBlade.types';

export const DECLINE_REQUEST_FORM_SCHEMA = (): Schema<DeclineRequestFormState> => {
	return object({
		reasonForDenial: string().optional(),
	});
};
