import { type GetServerSidePropsResult, type NextPage } from 'next';
import { type GetServerSidePropsContext } from 'next/types';
import { type ComponentType } from 'react';

import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { type UserProps } from '@shared/hooks/with-user';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { UserConditions } from '@user-conditions/UserConditions';

const UserConditionsEnglish: NextPage<DefaultSeoInfo & UserProps> = ({
	commonUser,
	url,
	locale,
}) => {
	return <UserConditions commonUser={commonUser} url={url} locale={locale} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.en.userPolicy);
}

export default withAdminCoreConfig(
	withUser(UserConditionsEnglish as NextPage<unknown>) as ComponentType
) as NextPage<DefaultSeoInfo>;
