import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminVisitorsPage } from '@cp/views/CpAdminVisitors';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const CpAdminVisitorsPageEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	return <CpAdminVisitorsPage url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(CpAdminVisitorsPageEnglish as ComponentType, true);