import { object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { ReportFormState } from './ReportBlade.types';

export const REPORT_FORM_SCHEMA = (): SchemaOf<ReportFormState> => {
	return object({
		report: string().required(tText('Probleem is verplicht.')),
		email: string()
			.email(tText('E-mail moet geldig zijn.'))
			.required(tText('E-mail is verplicht.')),
	});
};
