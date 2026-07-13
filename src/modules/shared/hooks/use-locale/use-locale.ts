import { Locale } from '@shared/utils/i18n';
import { useRouter } from 'next/router';

export const useLocale = (): Locale => {
	const router = useRouter();
	return (router.locale || Locale.nl) as Locale;
};
