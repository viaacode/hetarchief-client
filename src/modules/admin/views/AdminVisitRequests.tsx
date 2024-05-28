import React, { FC } from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@admin/const/Requests.const';
import { AdminLayout } from '@admin/layouts';
import VisitRequestsOverview from '@modules/visit-requests/components/VisitRequestsOverview/VisitRequestsOverview';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const AdminVisitRequests: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText(
					'pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen'
				)}
			>
				<AdminLayout.Content>
					<VisitRequestsOverview columns={RequestTableColumns()} />
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen'
				),
				tText(
					'pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.MANAGE_ALL_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
