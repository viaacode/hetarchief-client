import { Button } from '@meemoo/react-components';
import { type Avo } from '@viaa/avo2-types';
import Link from 'next/link';
import React, { type FC, lazy, Suspense } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { Loading } from '@shared/components/Loading';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ADMIN_CORE_ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type DefaultSeoInfo } from '@shared/types/seo';

const ContentPageOverview = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageOverview,
	}))
);

export const ContentPageOverviewPage: FC<
	DefaultSeoInfo & { commonUser: Avo.User.CommonUser | undefined }
> = ({ url, commonUser }) => {
	const locale = useLocale();
	const canCreateContentPages = useHasAllPermission(Permission.CREATE_CONTENT_PAGES) || true; // TODO remove once permission is added to the database

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tText('admin/content/views/content-overview___content-overzicht')}
				className="p-admin-content-page-overview"
			>
				<AdminLayout.Actions>
					{canCreateContentPages && (
						<Link
							href={
								ADMIN_CORE_ROUTES_BY_LOCALE[locale]
									.ADMIN_CONTENT_PAGE_CREATE as string
							}
							passHref
						>
							<a
								aria-label={tText(
									'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
								)}
							>
								<Button
									label={tText(
										'admin/content/views/content-overview___content-toevoegen'
									)}
									title={tText(
										'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
									)}
								/>
							</a>
						</Link>
					)}
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<div className="l-container p-admin-content">
						<Suspense fallback={<Loading fullscreen owner="ContentPageOverviewPage" />}>
							<ContentPageOverview commonUser={commonUser} />
						</Suspense>
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<SeoTags
				title={tText('pages/admin/content/index___content-paginas')}
				description={tText(
					'pages/admin/content/index___overzicht-van-alle-content-paginas-die-beschikbaar-zijn-binnen-het-archief'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck
				anyPermissions={[
					Permission.EDIT_ANY_CONTENT_PAGES,
					Permission.EDIT_OWN_CONTENT_PAGES,
				]}
			>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
