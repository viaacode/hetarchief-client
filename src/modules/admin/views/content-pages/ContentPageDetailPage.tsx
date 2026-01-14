'use client';

// https://github.com/vercel/next.js/issues/47232

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
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { useRouter } from 'next/router';
import React, { type FC, lazy, Suspense } from 'react';

const ContentPageDetail = lazy(() =>
	import('@meemoo/admin-core-ui/admin').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageDetail,
	}))
);

interface ContentPageDetailPageProps {
	id: string;
}

export const ContentPageDetailPage: FC<
	DefaultSeoInfo & {
		commonUser: AvoUserCommonUser | undefined;
	} & ContentPageDetailPageProps
> = ({ url, canonicalUrl, commonUser, id }) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout className="p-admin-content-page-detail">
				<AdminLayout.Content>
					<Suspense fallback={<Loading fullscreen owner="ContentPageDetailPage" />}>
						<ContentPageDetail
							id={id}
							commonUser={commonUser as AvoUserCommonUser}
							onGoBack={() =>
								goBrowserBackWithFallback(ROUTES_BY_LOCALE[locale].adminContentPages, router)
							}
						/>
					</Suspense>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};
	return (
		<>
			<SeoTags
				title={tText('pages/admin/content/id/index___content-pagina-detail')}
				description={tText('pages/admin/content/id/index___detail-pagina-van-een-content-pagina')}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			<PermissionsCheck
				anyPermissions={[Permission.EDIT_ANY_CONTENT_PAGES, Permission.EDIT_OWN_CONTENT_PAGES]}
			>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
