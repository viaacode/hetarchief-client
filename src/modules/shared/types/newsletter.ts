export interface NewsletterFormState {
	firstName: string;
}

export interface GetNewsletterPreferencesResponse {
	newsletter: boolean;
}

export interface SetNewsletterPreferencesBody {
	firstName?: string;
	lastName?: string;
	mail?: string;
	preferences: GetNewsletterPreferencesResponse;
}
