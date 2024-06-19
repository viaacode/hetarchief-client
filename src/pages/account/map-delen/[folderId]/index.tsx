import { type GetServerSidePropsContext, type GetServerSidePropsResult, type NextPage } from 'next';
import { useRouter } from 'next/router';
import { type ComponentType } from 'react';

import { AccountSharedFolder } from '@account/views/ShareFolder';
import { withAuth } from '@auth/wrappers/with-auth';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { type DefaultSeoInfo } from '@shared/types/seo';

const AccountSharedFolderDutch: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	const folderId = router.asPath.split('/').pop();

	return <AccountSharedFolder url={url} folderId={folderId} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, ROUTES_BY_LOCALE.nl.accountShareFolder);
}

export default withAuth(AccountSharedFolderDutch as ComponentType, true);
