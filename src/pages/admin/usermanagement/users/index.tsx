import { GetServerSidePropsResult } from 'next';
import { GetServerSidePropsContext, NextPage } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { UsersOverviewPage } from '@admin/views/users/UsersOverviewPage';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

const UsersOverviewPageEnglish: NextPage<DefaultSeoInfo & UserProps> = ({ url, commonUser }) => {
	return <UsersOverviewPage url={url} commonUser={commonUser} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(
	withAdminCoreConfig(withUser(UsersOverviewPageEnglish as FC<unknown>) as ComponentType),
	true
) as NextPage<DefaultSeoInfo>;