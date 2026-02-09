import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { tText } from '@shared/helpers/translate';
import type { DefaultSeoInfo } from '@shared/types/seo';
import React, { type FC, lazy, Suspense } from 'react';

const NavigationBarOverview = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => ({
		default: adminCoreModule.NavigationBarOverview,
	}))
);

export const AdminNavigationOverview: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText(
					'modules/admin/views/navigation/admin-navigation-overview-page___navigatie'
				)}
			>
				<AdminLayout.Content>
					<div className="l-container u-mb-40 p-admin-navigation">
						<Suspense fallback={<Loading fullscreen locationId="AdminNavigationOverview" />}>
							<NavigationBarOverview />
						</Suspense>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/admin/navigatie/index___navigatie')}
				description={tText('pages/admin/navigatie/index___navigatie-meta-tag')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>

			<PermissionsCheck allPermissions={[Permission.EDIT_NAVIGATION_BARS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
