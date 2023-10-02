import { GetServerSidePropsResult } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';
import { i18n } from 'next-i18next';

import { getTranslations } from '@i18n/helpers/get-translations';
import { DefaultSeoInfo } from '@shared/types/seo';
import { isBrowser } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export async function getDefaultServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	// change caching to 30 minutes, since the backend also caches the translations for 30 minutes
	context.res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=1799');

	const translations = await getTranslations();
	i18n?.addResources('nl', 'common', translations);
	return {
		props: {
			url:
				(isBrowser() ? publicRuntimeConfig.CLIENT_URL : process.env.CLIENT_URL) +
				(context?.resolvedUrl || ''),
			_nextI18Next: {
				initialI18nStore: {
					nl: {
						common: translations,
					},
				},
			},
		},
	};
}
