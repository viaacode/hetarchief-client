import type { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { AdminNavigationBarDetailPage } from '@admin/views/navigation/AdminNavigationBarDetailPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';

const AdminNavigationBarDetailPageDutch: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	const router = useRouter();

	return (
		<AdminNavigationBarDetailPage
			navigationBarId={router.query.navigationBarId as string}
			url={url}
			locale={locale}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(AdminNavigationBarDetailPageDutch as ComponentType),
	true
);
