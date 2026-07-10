import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpacesHomePage } from '@visitor-space/views/VisitorSpacesHomePage';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';

const VisitorSpacesHomeEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitorSpacesHomePage {...seo} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default VisitorSpacesHomeEnglish;
