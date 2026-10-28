import { withAuth } from '@auth/wrappers/with-auth';
import { CpAdminOrganisationFolders } from '@cp/views/CpAdminOrganisationFolders';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { GetServerSidePropsResult, NextPage } from 'next';
import type { GetServerSidePropsContext } from 'next/types';
import type { ComponentType } from 'react';

// Without a folder in the url, the overview redirects to the first organisation folder
const CpAdminOrganisationFoldersEnglish: NextPage<DefaultSeoInfo> = ({ url, locale }) => {
	return <CpAdminOrganisationFolders folderSlug={undefined} url={url} locale={locale} />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context, context.resolvedUrl);
}

export default withAuth(CpAdminOrganisationFoldersEnglish as ComponentType, true);
