import { NavigationEdit } from '@meemoo/admin-core-ui';
import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

const NavigationPageCreatePage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<NavigationEdit
							navigationBarId={router.query.navigationBarId as string}
							navigationItemId={undefined}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText('pages/admin/navigatie/maak/index___navigatie-pagina-aanmaken'),
				tText('pages/admin/navigatie/maak/index___aanmaken-van-een-navigatie-item'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.EDIT_NAVIGATION_BARS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultStaticProps(context);
}

export default withAuth(withAdminCoreConfig(NavigationPageCreatePage as ComponentType), true);
