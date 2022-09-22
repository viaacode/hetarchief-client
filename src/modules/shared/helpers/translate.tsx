import { TOptions } from 'i18next';
import { i18n } from 'next-i18next';
import React, { ReactNode } from 'react';

import Html from '@shared/components/Html/Html';

/**
 * Wrapper around tText() that renders the translated text as html
 * @param key
 * @param params
 */
export function tHtml(key: string, params?: TOptions | string | undefined): ReactNode | string {
	const translatedValue: string = tText(key, params);

	if (translatedValue.includes('<')) {
		return <Html content={translatedValue} />;
	}

	return translatedValue;
}

/**
 * Wrapper around tText() that simply returns the translated text as a string
 * @param key
 * @param params
 */
export function tText(key: string, params?: TOptions | string | undefined): string {
	const translation: string | null | undefined = i18n?.t(key, params);

	// Fallback to formatted key + *** if translation is missing
	if (!translation || translation === key) {
		return key.split('___')[1].replace('-', ' ') + ' ***';
	}

	return translation;
}
