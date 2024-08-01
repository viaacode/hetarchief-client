import { ContentPageLabelDetail } from '@meemoo/admin-core-ui';
import { useRouter } from 'next/router';
import React, { type FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageLabelsDetailPage: FC<DefaultSeoInfo> = ({ url }) => {
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__detail">
						<ContentPageLabelDetail contentPageLabelId={router.query.id as string} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText(
					'pages/admin/content-pagina-labels/id/index___content-pagina-label-detail-pagina'
				)}
				description={tText(
					'pages/admin/content-pagina-labels/id/index___toont-de-details-van-een-content-pagina-label'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
