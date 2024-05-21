import { ContentPageLabelEdit } from '@meemoo/admin-core-ui';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageLabelsEditPage: FC<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__create">
						<ContentPageLabelEdit contentPageLabelId={undefined} />
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/content-pagina-labels/maak/index___content-pagina-label-aanmaak-pagina'
				),
				tText(
					'pages/admin/content-pagina-labels/maak/index___laat-de-gebruiker-een-content-pagina-label-aanmaken'
				),
				url
			)}
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
