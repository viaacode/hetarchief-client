import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorSpacesHomePage } from '@visitor-space/views/VisitorSpacesHomePage';

const VisitorSpacesHomeDutch: NextPage<DefaultSeoInfo> = (seo) => {
	return <VisitorSpacesHomePage {...seo} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.visit);
}

export default VisitorSpacesHomeDutch;
