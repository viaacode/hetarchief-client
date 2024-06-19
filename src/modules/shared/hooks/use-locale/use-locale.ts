import { useRouter } from 'next/router';

import { Locale } from '@shared/utils/i18n';

export const useLocale = (): Locale => {
	const router = useRouter();
	return (router.locale || Locale.nl) as Locale;
};
