import { useRouter } from 'next/router';
import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { buildLink } from '@shared/helpers/build-link';
import { goBrowserBackWithFallback } from '@shared/helpers/go-browser-back-with-fallback';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';

const NavigationItemEdit = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.NavigationItemEdit,
	}))
);

interface NavigationPageCreatePageProps {
	navigationBarId: string;
	navigationItemId: string;
}

export const AdminNavigationItemEditPage: FC<DefaultSeoInfo & NavigationPageCreatePageProps> = ({
	url,
	navigationBarId,
	navigationItemId,
}) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-navigation__create">
						<NoServerSideRendering>
							<Suspense
								fallback={
									<Loading fullscreen owner="AdminNavigationItemEditPage" />
								}
							>
								<NavigationItemEdit
									navigationBarId={navigationBarId}
									navigationItemId={navigationItemId}
									onGoBack={() =>
										goBrowserBackWithFallback(
											buildLink(
												ROUTES_BY_LOCALE[locale].adminNavigationBarDetail,
												{ navigationBarId }
											),
											router
										)
									}
								/>
							</Suspense>
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
