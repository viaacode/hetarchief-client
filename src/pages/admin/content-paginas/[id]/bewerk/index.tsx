import type { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { type ComponentType } from 'react';

import { ContentPageEditPage } from '@admin/views/content-pages/ContentPageEditPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import type { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageEditPageDutch: NextPage<DefaultSeoInfo & UserProps> = ({
	url,
	locale,
	commonUser,
}) => {
	const router = useRouter();

	return (
		<ContentPageEditPage
			url={url}
			locale={locale}
			commonUser={commonUser}
			id={router.query.id as string}
		/>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(
	withAdminCoreConfig(withUser(ContentPageEditPageDutch) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;
