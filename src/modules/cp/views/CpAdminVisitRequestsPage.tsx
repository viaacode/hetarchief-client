import type { FC } from 'react';

import { Permission } from '@account/const';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import VisitRequestsOverview from '@visit-requests/components/VisitRequestsOverview/VisitRequestsOverview';

export const CpAdminVisitRequestsPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
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
			<SeoTags
				title={`${tText('pages/beheer/toegangsaanvragen/index___toegangsaanvragen')} | ${tText('modules/cp/views/cp-admin-visit-requests-page___beheer')}`}
				description={tText(
					'pages/beheer/toegangsaanvragen/index___toegangsaanvragen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.MANAGE_CP_VISIT_REQUESTS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
