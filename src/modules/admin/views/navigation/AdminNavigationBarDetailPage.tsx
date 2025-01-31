import { useRouter } from 'next/router';
import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { goBrowserBackWithFallback } from '@shared/helpers/go-browser-back-with-fallback';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';

const NavigationBarDetail = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.NavigationBarDetail,
	}))
);

interface AdminNavigationBarDetailPage {
	navigationBarId: string;
}

export const AdminNavigationBarDetailPage: FC<DefaultSeoInfo & AdminNavigationBarDetailPage> = ({
	url,
	navigationBarId,
}) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__detail">
						<Suspense fallback={<Loading fullscreen owner="AdminNavigationBarDetailPage" />}>
							<NavigationBarDetail
								navigationBarId={navigationBarId}
								onGoBack={() =>
									goBrowserBackWithFallback(
										ROUTES_BY_LOCALE[locale].adminNavigationBarOverview,
										router
									)
								}
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
				title={tText('pages/admin/navigatie/navigation-bar-id/index___navigatie-balk-detail')}
				description={tText(
					'pages/admin/navigatie/navigation-bar-id/index___de-detail-pagina-van-een-navigatie-balk-met-de-navigatie-items'
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
