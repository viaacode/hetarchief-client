import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { NewsletterConfirmation } from '@modules/newsletter/NewsletterConfirmation';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const NewsletterConfirmationDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <NewsletterConfirmation url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default NewsletterConfirmationDutch;
