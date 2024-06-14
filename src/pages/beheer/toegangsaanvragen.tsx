import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminVisitRequestsPage } from '@cp/views/CpAdminVisitRequestsPage';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminVisitorRequestsPageDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <CpAdminVisitRequestsPage url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.cpAdminVisitRequests);
}

export default withAuth(CpAdminVisitorRequestsPageDutch as ComponentType, true);
