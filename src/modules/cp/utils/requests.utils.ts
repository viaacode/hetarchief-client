import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { i18n } from 'next-i18next';

import { getLocaleFromi18nLanguage } from '@shared/utils';

export const requestCreatedAtFormatter = (input: Date | string): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');
	const date: Date = new Date(input);

	if (differenceInDays(new Date(), date) <= 5) {
		return formatDistanceToNow(date, {
			addSuffix: true,
			locale,
		});
	}

	return format(date, 'PPpp', {
		locale,
	});
};
