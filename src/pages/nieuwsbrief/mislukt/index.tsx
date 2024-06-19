import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';

import { NewsletterFailed } from '@newsletter/NewsletterFailed';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const NewsletterFailedDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <NewsletterFailed url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.newsletterFailed);
}

export default NewsletterFailedDutch;
