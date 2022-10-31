import { GetServerSidePropsResult } from 'next';
import { i18n } from 'next-i18next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';

import { getTranslations } from '@i18n/helpers/get-translations';
import { DefaultSeoInfo } from '@shared/types/seo';

const { publicRuntimeConfig } = getConfig();

export async function getDefaultServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const translations = await getTranslations();
	i18n?.addResources('nl', 'common', translations);
	return {
		props: {
			url: publicRuntimeConfig.CLIENT_URL + (context?.resolvedUrl || ''),
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
