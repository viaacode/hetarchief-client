import { useRouter } from 'next/router';

import { Locale } from '@shared/utils';

// Based on https://pineco.de/snippets/get-the-width-of-scrollbar-using-javascript/

export const useLocale = (): Locale => {
	const router = useRouter();

	return (router.locale || Locale.nl) as Locale;
};
