import { format } from 'date-fns';
import { i18n } from 'next-i18next';

import { getLocaleFromi18nLanguage } from '@shared/utils';

export const formatApproveRequestAccessDate = (date?: Date): string => {
	return formatWithLocale('P', date);
};

export const formatApproveRequestAccessTime = (date?: Date): string => {
	return formatWithLocale('p', date);
};

export const formatWithLocale = (formatString: string, date?: Date): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');
	return date ? format(date, formatString, { locale }) : '';
};
