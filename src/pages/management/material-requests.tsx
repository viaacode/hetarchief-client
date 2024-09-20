import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminMaterialRequests } from '@cp/views/CpAdminMaterialRequests';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const CpAdminMaterialRequestsPageEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <CpAdminMaterialRequests url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.cpAdminMaterialRequests);
}

export default withAuth(CpAdminMaterialRequestsPageEnglish as ComponentType, true);
