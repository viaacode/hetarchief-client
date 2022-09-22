import { NavigationEdit } from '@meemoo/react-admin';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAdminCoreConfig } from '@admin/wrappers/with-admin-core-config';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAnyRequiredPermissions } from '@shared/hoc/withAnyRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';

const { publicRuntimeConfig } = getConfig();

const ContentPageEditPage: FC = () => {
	const { tText } = useTranslation();
	const router = useRouter();

	return (
		<>
			{renderOgTags(
				tText('pages/admin/content/id/bewerk/index___content-pagina-bewerken'),
				tText('pages/admin/content/id/bewerk/index___bewerk-pagina-van-een-content-pagina'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__edit">
						<NavigationEdit
							navigationBarId={router.query.navigationBarId as string}
							navigationItemId={router.query.navigationItemId as string}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageEditPage),
		Permission.EDIT_NAVIGATION_BARS
	)
);
