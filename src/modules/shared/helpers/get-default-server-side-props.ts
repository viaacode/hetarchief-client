import { GetServerSidePropsResult } from 'next';
import getConfig from 'next/config';
import { GetServerSidePropsContext } from 'next/types';

import { getTranslations } from '@i18n/helpers/get-translations';
import { DefaultSeoInfo } from '@shared/types/seo';

const { publicRuntimeConfig } = getConfig();

export async function getDefaultServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	const translations = await getTranslations();
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
