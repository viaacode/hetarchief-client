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

const ContentPageLabelEdit = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageLabelEdit,
	}))
);

interface ContentPageLabelsEditPageProps {
	id: string | undefined;
}

export const ContentPageLabelsEditPage: FC<DefaultSeoInfo & ContentPageLabelsEditPageProps> = ({
	url,
	id,
}) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout>
				<AdminLayout.Content>
					<div className="l-container p-admin-content-page-labels__create">
						<Suspense
							fallback={<Loading fullscreen owner="ContentPageLabelsEditPage" />}
						>
							<ContentPageLabelEdit
								contentPageLabelId={id}
								onGoBack={() =>
									goBrowserBackWithFallback(
										buildLink(
											ROUTES_BY_LOCALE[locale].adminContentPageLabelDetail,
											{ id }
										),
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

	const title = id
		? tText(
				'pages/admin/content-pagina-labels/id/bewerk/index___content-pagina-label-bewerk-pagina'
		  )
		: tText(
				'pages/admin/content-pagina-labels/maak/index___content-pagina-label-aanmaak-pagina'
		  );
	const description = id
		? tText(
				'pages/admin/content-pagina-labels/id/bewerk/index___laat-de-gebruik-de-details-van-een-content-pagina-label-aanpassen'
		  )
		: tText(
				'pages/admin/content-pagina-labels/maak/index___laat-de-gebruiker-een-content-pagina-label-aanmaken'
		  );
	return (
		<>
			<SeoTags
				title={title}
				description={description}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck anyPermissions={[Permission.EDIT_CONTENT_PAGE_LABELS]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
