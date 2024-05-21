import { ContentPageEdit } from '@meemoo/admin-core-ui';
import { type Avo } from '@viaa/avo2-types';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

export const ContentPageEditPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined }
> = ({ url, commonUser }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false} className="p-admin-content-page-create">
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<ContentPageEdit
							id={undefined}
							commonUser={commonUser as Avo.User.CommonUser}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText('pages/admin/content/maak/index___content-pagina-aanmaken'),
				tText(
					'pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.CREATE_CONTENT_PAGES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
