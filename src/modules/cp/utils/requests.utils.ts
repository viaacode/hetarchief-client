import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { i18n } from 'next-i18next';

import { asDate, formatMediumDateWithTime, getLocaleFromi18nLanguage } from '@shared/utils';

export const requestCreatedAtFormatter = (input: Date | string): string => {
	const date = asDate(input);

	if (date && differenceInDays(new Date(), date) <= 5) {
		return formatDistanceToNow(date, {
			addSuffix: true,
			locale: getLocaleFromi18nLanguage(i18n?.language || ''),
		});
	}

	return date ? formatMediumDateWithTime(date) : '';
};
