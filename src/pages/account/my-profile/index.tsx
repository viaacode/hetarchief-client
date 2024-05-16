import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import AccountMyProfile from '../mijn-profiel';

export default AccountMyProfile;

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}
