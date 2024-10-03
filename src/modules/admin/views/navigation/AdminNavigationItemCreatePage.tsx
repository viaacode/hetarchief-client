import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import { type DefaultSeoInfo } from '@shared/types/seo';

const NavigationItemEdit = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.NavigationItemEdit,
	}))
);

interface AdminNavigationItemCreatePage {
	navigationBarId: string;
}

export const AdminNavigationItemCreatePage: FC<DefaultSeoInfo & AdminNavigationItemCreatePage> = ({
	url,
	navigationBarId,
}) => {
	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<Suspense
							fallback={<Loading fullscreen owner="AdminNavigationItemCreatePage" />}
						>
							<NavigationItemEdit
								navigationBarId={navigationBarId}
								navigationItemId={undefined}
							/>
						</Suspense>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText('pages/admin/content/maak/index___content-pagina-bewerken')}
				description={tText(
					'pages/admin/content/maak/index___bewerk-pagina-van-een-content-pagina'
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
