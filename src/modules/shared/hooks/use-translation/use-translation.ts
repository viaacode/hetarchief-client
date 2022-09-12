import { ReactNode } from 'react';

import { t, tText } from '@shared/helpers/translate';
import { TranslationParamValue } from '@shared/services/translation-service/translation-service';

export type useTranslationsResponse = {
	t: (key: string, params?: Record<string, TranslationParamValue>) => ReactNode;
	tText: (key: string, params?: Record<string, TranslationParamValue>) => string;
};

const useTranslation = (): useTranslationsResponse => {
	return { t, tText };
};

export default useTranslation;
