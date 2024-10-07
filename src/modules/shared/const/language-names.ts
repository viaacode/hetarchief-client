import { tText } from '@shared/helpers/translate';
import { Locale } from '@shared/utils/i18n';

export function GET_LANGUAGE_NAMES(): Record<Locale, string> {
	return {
		[Locale.nl]: tText('modules/shared/const/language-names___nederlands'),
		[Locale.en]: tText('modules/shared/const/language-names___engels'),
	};
}
