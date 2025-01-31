import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

import { NewsletterFailed } from '@newsletter/NewsletterFailed';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const NewsletterFailedEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <NewsletterFailed url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.newsletterFailed);
}

export default NewsletterFailedEnglish;
