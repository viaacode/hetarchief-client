import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@admin/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const MeemooAdminRequestsPage: NextPage = () => {
	const { tHtml, tText } = useTranslation();

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						tText('pages/admin/bezoekersruimtesbeheer/aanvragen/index___aanvragen')
					)}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/bezoekersruimtesbeheer/aanvragen/index___aanvragen-meta-omschrijving'
					)}
				/>
			</Head>

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

export default withAuth(
	withAllRequiredPermissions(MeemooAdminRequestsPage, Permission.READ_ALL_VISIT_REQUESTS)
);
