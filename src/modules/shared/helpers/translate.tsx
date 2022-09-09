import React, { ReactNode } from 'react';

import Html from '@shared/components/Html/Html';
import {
	TranslationParamValue,
	TranslationService,
} from '@shared/services/translation-service/translation-service';

export function t(key: string, params?: Record<string, TranslationParamValue>): ReactNode {
	const translatedValue: string = TranslationService.getTranslation(key, params);
	if (translatedValue.includes('<')) {
		return <Html content={translatedValue} />;
	}
	return translatedValue;
}

export function tText(key: string, params?: Record<string, TranslationParamValue>): string {
	return TranslationService.getTranslation(key, params);
}
