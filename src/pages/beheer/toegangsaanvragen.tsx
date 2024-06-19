import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminVisitRequestsPage } from '@cp/views/CpAdminVisitRequestsPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const CpAdminVisitorRequestsPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <CpAdminVisitRequestsPage url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.cpAdminVisitRequests);
}

export default withAuth(CpAdminVisitorRequestsPageDutch as ComponentType, true);
