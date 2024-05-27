import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ComponentType } from 'react';

import { AccountSharedFolder } from '@account/views/ShareFolder';
import { withAuth } from '@auth/wrappers/with-auth';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

const AccountSharedFolderEnglish: NextPage<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	const folderId = router.asPath.split('/').pop();

	return <AccountSharedFolder url={url} folderId={folderId} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(AccountSharedFolderEnglish as ComponentType, true);
