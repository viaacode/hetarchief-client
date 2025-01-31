import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminVisitorsPage } from '@cp/views/CpAdminVisitors';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminVisitorsPageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <CpAdminVisitorsPage url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.cpAdminVisitors);
}

export default withAuth(CpAdminVisitorsPageDutch as ComponentType, true);
