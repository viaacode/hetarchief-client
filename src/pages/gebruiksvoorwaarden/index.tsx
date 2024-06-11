import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';

import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import withUser, { UserProps } from '@shared/hooks/with-user';
import { DefaultSeoInfo } from '@shared/types/seo';
import { UserConditions } from '@user-conditions/UserConditions';

const UserConditionsDutch: NextPage<DefaultSeoInfo & UserProps> = ({ commonUser, url }) => {
	return <UserConditions commonUser={commonUser} url={url} />;
};

export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, undefined, ROUTES_BY_LOCALE.nl.userPolicy);
}

export default withUser(UserConditionsDutch as NextPage<unknown>) as NextPage<DefaultSeoInfo>;
