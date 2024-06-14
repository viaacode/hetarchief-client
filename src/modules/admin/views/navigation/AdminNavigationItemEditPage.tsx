import { NavigationEdit } from '@meemoo/admin-core-ui';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

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
						<NoServerSideRendering>
							<NavigationEdit
								navigationBarId={navigationBarId}
								navigationItemId={navigationItemId}
							/>
						</NoServerSideRendering>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText('pages/admin/navigatie/maak/index___navigatie-pagina-aanmaken')}
				description={tText(
					'pages/admin/navigatie/maak/index___aanmaken-van-een-navigatie-item'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_NAVIGATION_BARS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
