export interface CommunicationFormState {
	acceptNewsletter: boolean;
}

export interface GetNewsletterPreferencesResponse {
	newsletter: boolean;
}

export interface SetNewsletterPreferencesBody {
	firstName: string;
	lastName: string;
	mail: string;
	preferences: GetNewsletterPreferencesResponse;
}
