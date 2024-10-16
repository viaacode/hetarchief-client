import fetch, { Headers } from 'node-fetch';

export enum App {
	AVO = 'AVO',
	HET_ARCHIEF = 'HET_ARCHIEF',
}
export enum Component {
	ADMIN_CORE = 'ADMIN_CORE',
	FRONTEND = 'FRONTEND',
	BACKEND = 'BACKEND',
}
export type Location = string;
export type Key = string;

export enum ValueType {
	TEXT = 'TEXT',
	HTML = 'HTML',
}

export enum Locale {
	Nl = 'nl',
	En = 'en',
}

export interface TranslationEntry {
	app: App;
	component: Component;
	location: Location;
	key: Key;
	language: Locale;
	value: string;
	value_type: ValueType | null;
}

export const TRANSLATION_SEPARATOR = '___';

export function getFullKey(
	translationEntry: TranslationEntry
): `${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}

export async function executeDatabaseQuery(query: string, variables: any = {}): Promise<any> {
	if (!process.env.GRAPHQL_URL || !process.env.GRAPHQL_SECRET) {
		throw new Error(
			'Missing environment variables. One or more of these are missing: GRAPHQL_URL, GRAPHQL_SECRET'
		);
	}
	let graphQlUrl = '';
	let graphQlPassword = '';
	// We need the QAS database environment variables to fetch the latest translations and QAS is the "master" of all translations
	graphQlUrl = process.env.GRAPHQL_URL as string;
	graphQlPassword = process.env.GRAPHQL_SECRET as string;

	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('x-hasura-admin-secret', graphQlPassword);

	const raw = JSON.stringify({
		query,
		variables,
	});

	const requestOptions = {
		method: 'POST',
		headers: requestHeaders,
		body: raw,
	};

	const response = await fetch(graphQlUrl, requestOptions);
	return await response.json();
}

async function getOnlineTranslations(): Promise<TranslationEntry[]> {
	const response = await executeDatabaseQuery(
		`
	query getAllTranslations {
	  app_translations {
	    component
	    key
	    language
	    location
	    value
	    value_type
	  }
	}
		`,
		{}
	);
	return response.data.app_translations.map((t: TranslationEntry) => ({ ...t }));
}

let SITE_TRANSLATIONS: Record<'nl' | 'en', Record<string, string>> | null = null;

/**
 * Fetches the translations from the QAS database and returns them in a format that can be used in the tests.
 * Also caches the translations so they don't have to be fetched again within the same test
 */
export async function getSiteTranslations() {
	if (SITE_TRANSLATIONS) {
		return SITE_TRANSLATIONS;
	}
	const translations = await getOnlineTranslations();
	const translationsByLocale: Record<'nl' | 'en', Record<string, string>> = {
		nl: {},
		en: {},
	};
	translations.map((translationEntry: TranslationEntry) => {
		translationsByLocale[translationEntry.language][getFullKey(translationEntry)] =
			translationEntry.value;
	});
	SITE_TRANSLATIONS = translationsByLocale;
	return translationsByLocale;
}
