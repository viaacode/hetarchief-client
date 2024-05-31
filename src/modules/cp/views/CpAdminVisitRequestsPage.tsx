import { FC } from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import VisitRequestsOverview from '@visit-requests/components/VisitRequestsOverview/VisitRequestsOverview';

export const CpAdminVisitRequestsPage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={tText('pages/beheer/toegangsaanvragen/index___toegangsaanvragen')}
			>
				<VisitRequestsOverview columns={RequestTableColumns()} />
			</CPAdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/toegangsaanvragen/index___toegangsaanvragen'),
				tText('pages/beheer/toegangsaanvragen/index___toegangsaanvragen-meta-omschrijving'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.MANAGE_CP_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
