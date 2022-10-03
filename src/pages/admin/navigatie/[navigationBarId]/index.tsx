import { NavigationDetail } from '@meemoo/react-admin';
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

const ContentPageDetailPage: FC = () => {
	const { tText } = useTranslation();
	const router = useRouter();

	return (
		<>
			{renderOgTags(
				tText('pages/admin/navigatie/navigation-bar-id/index___navigatie-balk-detail'),
				tText(
					'pages/admin/navigatie/navigation-bar-id/index___de-detail-pagina-van-een-navigatie-balk-met-de-navigatie-items'
				),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__detail">
						<NavigationDetail
							navigationBarId={router.query.navigationBarId as string}
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
		withAdminCoreConfig(ContentPageDetailPage),
		Permission.EDIT_NAVIGATION_BARS
	)
);
