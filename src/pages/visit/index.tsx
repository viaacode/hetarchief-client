import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpacesHomePage } from '@visitor-space/views/VisitorSpacesHomePage';

const VisitorSpacesHomeEnglish: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitorSpacesHomePage {...seo} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default VisitorSpacesHomeEnglish;
