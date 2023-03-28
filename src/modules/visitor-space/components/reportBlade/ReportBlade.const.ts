import { object, SchemaOf, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { ReportFormState } from './ReportBlade.types';

export const REPORT_FORM_SCHEMA = (): SchemaOf<ReportFormState> => {
	return object({
		report: string().required(
			tText(
				'modules/visitor-space/components/report-blade/report-blade___probleem-is-verplicht'
			)
		),
		email: string()
			.email(
				tText(
					'modules/visitor-space/components/report-blade/report-blade___e-mail-moet-geldig-zijn'
				)
			)
			.required(
				tText(
					'modules/visitor-space/components/report-blade/report-blade___e-mail-is-verplicht'
				)
			),
	});
};
