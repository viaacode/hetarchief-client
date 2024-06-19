import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpacesHomePage } from '@visitor-space/views/VisitorSpacesHomePage';

const VisitorSpacesHomeEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitorSpacesHomePage {...seo} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default VisitorSpacesHomeEnglish;
