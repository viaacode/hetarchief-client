import { NavigationEdit } from '@meemoo/admin-core-ui';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

interface NavigationPageCreatePageProps {
	navigationBarId: string;
	navigationItemId: string;
}

export const AdminNavigationItemEditPage: FC<DefaultSeoInfo & NavigationPageCreatePageProps> = ({
	url,
	navigationBarId,
	navigationItemId,
}) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<NavigationEdit
							navigationBarId={navigationBarId}
							navigationItemId={navigationItemId}
						/>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			{renderOgTags(
				tText('pages/admin/navigatie/maak/index___navigatie-pagina-aanmaken'),
				tText('pages/admin/navigatie/maak/index___aanmaken-van-een-navigatie-item'),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.EDIT_NAVIGATION_BARS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
