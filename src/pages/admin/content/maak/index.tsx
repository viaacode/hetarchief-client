import { ContentPageEdit } from '@meemoo/react-admin';
import getConfig from 'next/config';
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

	return (
		<>
			{renderOgTags(
				tText('pages/admin/content/maak/index___content-pagina-aanmaken'),
				tText(
					'pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken'
				),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout>
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit id={undefined} />
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
		Permission.CREATE_CONTENT_PAGES
	)
);
