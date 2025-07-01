import type { Locale } from '@shared/utils/i18n';

export interface Alert {
	id: string;
	title: string;
	message: string;
	type: string;
	userGroups: string[];
	fromDate: string;
	untilDate: string;
	language: Locale;
}
