import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { NewsletterConfirmation } from '@newsletter/NewsletterConfirmation';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const NewsletterConfirmationDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <NewsletterConfirmation url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.newsletterConfirm);
}

export default NewsletterConfirmationDutch;
