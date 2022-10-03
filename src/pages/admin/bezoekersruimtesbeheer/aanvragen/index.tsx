import { NextPage } from 'next';
import getConfig from 'next/config';
import React from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const { publicRuntimeConfig } = getConfig();

const MeemooAdminRequestsPage: NextPage = () => {
	const { tHtml, tText } = useTranslation();

	return (
		<>
			{renderOgTags(
				tText('pages/admin/bezoekersruimtesbeheer/aanvragen/index___aanvragen'),
				tText(
					'pages/admin/bezoekersruimtesbeheer/aanvragen/index___aanvragen-meta-omschrijving'
				),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout
				pageTitle={tHtml('pages/admin/bezoekersruimtesbeheer/aanvragen/index___aanvragen')}
			>
				<AdminLayout.Content>
					<VisitRequestsOverview columns={RequestTableColumns()} />
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(MeemooAdminRequestsPage, Permission.READ_ALL_VISIT_REQUESTS)
);
