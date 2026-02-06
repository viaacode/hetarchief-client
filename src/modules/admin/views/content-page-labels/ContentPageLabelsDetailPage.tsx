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
import { useRouter } from 'next/router';
import React, { type FC, lazy, Suspense } from 'react';

const ContentPageLabelDetail = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageLabelDetail,
	}))
);

export const ContentPageLabelsDetailPage: FC<DefaultSeoInfo> = ({ url, canonicalUrl }) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__detail">
						<Suspense fallback={<Loading fullscreen locationId="ContentPageLabelsDetailPage" />}>
							<ContentPageLabelDetail
								contentPageLabelId={router.query.id as string}
								onGoBack={() =>
									goBrowserBackWithFallback(ROUTES_BY_LOCALE[locale].adminContentPageLabels, router)
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
				title={tText(
					'pages/admin/content-pagina-labels/id/index___content-pagina-label-detail-pagina'
				)}
				description={tText(
					'pages/admin/content-pagina-labels/id/index___toont-de-details-van-een-content-pagina-label'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
