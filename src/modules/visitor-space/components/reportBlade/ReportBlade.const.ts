import { object, type Schema, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { type ReportFormState } from './ReportBlade.types';

export const REPORT_FORM_SCHEMA = (): Schema<ReportFormState> => {
	return object({
		reportMessage: string().required(
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
