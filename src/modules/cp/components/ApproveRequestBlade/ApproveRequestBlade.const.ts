import { format } from 'date-fns';
import { i18n } from 'next-i18next';
import { date, object, SchemaOf, string } from 'yup';

import { getLocaleFromi18nLanguage } from '@shared/utils';

import { ApproveRequestFormState } from './ApproveRequestBlade.types';

export const APPROVE_REQUEST_FORM_SCHEMA = (): SchemaOf<ApproveRequestFormState> => {
	return object({
		accessFrom: date().required(
			i18n?.t(
				'modules/cp/components/approve-request-blade/approve-request-blade___een-startdatum-is-verplicht'
			)
		),
		accessTo: date().required(
			i18n?.t(
				'modules/cp/components/approve-request-blade/approve-request-blade___een-einddatum-is-verplicht'
			)
		),
		accessRemark: string().optional(),
	});
};

export const ApproveRequestAccessDateFormatter = (date?: Date): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');
	return date ? format(date, 'P', { locale }) : '';
};

export const ApproveRequestAccessTimeFormatter = (date?: Date): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');
	return date ? format(date, 'p', { locale }) : '';
};
