import type { Locale } from '@shared/utils/i18n';

export interface NewsletterFormState {
	firstName: string;
	lastName: string;
	mail: string;
}

export interface GetNewsletterPreferencesResponse {
	newsletter: boolean;
}

export interface SetNewsletterPreferencesBody {
	firstName?: string;
	lastName?: string;
	mail?: string;
	preferences: GetNewsletterPreferencesResponse;
	language?: Locale;
}
