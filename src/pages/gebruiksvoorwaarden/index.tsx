import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';

import { UserConditions } from '../../modules/user-conditions/UserConditions';

const UserConditionsDutch: NextPage<DefaultSeoInfo & UserProps> = ({ commonUser, url }) => {
	return <UserConditions commonUser={commonUser} url={url} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAdminCoreConfig(
	withUser(UserConditionsDutch as NextPage<unknown>) as ComponentType
) as NextPage<DefaultSeoInfo>;
