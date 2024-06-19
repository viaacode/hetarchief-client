import React, { type FC } from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@admin/const/Requests.const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { type DefaultSeoInfo } from '@shared/types/seo';
import VisitRequestsOverview from '@visit-requests/components/VisitRequestsOverview/VisitRequestsOverview';

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
			<SeoTags
				title={tText(
					'pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen'
				)}
				description={tText(
					'pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_ALL_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
