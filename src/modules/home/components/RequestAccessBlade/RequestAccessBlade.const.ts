import { i18n } from 'next-i18next';
import { boolean, object, string } from 'yup';

export const REQUEST_ACCESS_FORM_SCHEMA = object({
	requestReason: string().required(i18n?.t('Reden van aanvraag is een verplicht veld')),
	visitTime: string().optional(),
	acceptTerms: boolean().optional(),
});
