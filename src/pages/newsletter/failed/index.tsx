import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import { NewsletterFailed } from '../../../modules/newsletter/NewsletterFailed';

const NewsletterFailedEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <NewsletterFailed url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default NewsletterFailedEnglish;
