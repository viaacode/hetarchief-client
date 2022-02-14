import { i18n } from 'next-i18next';
import { date, object, SchemaOf, string } from 'yup';

import { ApproveRequestFormState } from './ApproveRequestBlade.types';

export const APPROVE_REQUEST_FORM_SCHEMA = (): SchemaOf<ApproveRequestFormState> => {
	return object({
		accessFrom: date().required(i18n?.t('Een startdatum is verplicht.')),
		accessTo: date().required(i18n?.t('Een einddatum is verplicht.')),
		accessRemark: string().optional(),
	});
};
