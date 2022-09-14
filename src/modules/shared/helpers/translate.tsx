import { TOptions } from 'i18next';
import React, { ReactNode } from 'react';

import Html from '@shared/components/Html/Html';
import { i18n } from '@shared/helpers/i18n';

/**
 * Wrapper around i18n.t() that renders the translated text as html
 * @param key
 * @param params
 */
export function tHtml(key: string, params?: TOptions | string | undefined): ReactNode | string {
	const translatedValue: string = i18n.t(key, params);
	if (translatedValue.includes('<')) {
		return <Html content={translatedValue} />;
	}
	return translatedValue;
}

/**
 * Wrapper around i18n.t() that simply returns the translated text as a string
 * @param key
 * @param params
 */
export function tText(key: string, params?: TOptions | string | undefined): string {
	return i18n.t(key, params);
}
