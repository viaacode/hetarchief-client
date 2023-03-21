import { object, SchemaOf, string } from 'yup';

import { ReportFormState } from './ReportBlade.types';

export const REPORT_FORM_SCHEMA = (): SchemaOf<ReportFormState> => {
	return object({
		report: string().required(),
		email: string().required(),
	});
};
