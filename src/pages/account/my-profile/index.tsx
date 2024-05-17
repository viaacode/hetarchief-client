import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

import AccountMyProfile from '../mijn-profiel';

export default AccountMyProfile;

// export async function getServerSideProps(
// 	context: GetServerSidePropsContext
// ): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
// 	return getDefaultStaticProps(context);
// }
export async function getStaticProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}
