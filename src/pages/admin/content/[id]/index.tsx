import { ContentPageDetail } from '@meemoo/react-admin';
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
				tText('pages/admin/content/id/index___content-pagina-detail'),
				tText('pages/admin/content/id/index___detail-pagina-van-een-content-pagina'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout>
				<AdminLayout.Content>
					<ContentPageDetail id={router.query.id as string} />
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAnyRequiredPermissions(
		withAdminCoreConfig(ContentPageDetailPage),
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES
	)
);
