import type { Avo } from '@viaa/avo2-types';
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
import type { DefaultSeoInfo } from '@shared/types/seo';

const ContentPageEdit = lazy(() =>
	import('@meemoo/admin-core-ui/dist/admin.mjs').then((adminCoreModule) => ({
		default: adminCoreModule.ContentPageEdit,
	}))
);

interface ContentPageEditPageProps {
	id: string | undefined;
}

export const ContentPageEditPage: FC<
	DefaultSeoInfo & {
		commonUser: Avo.User.CommonUser | undefined;
	} & ContentPageEditPageProps
> = ({ url, commonUser, id }) => {
	const locale = useLocale();
	const router = useRouter();

	const renderPageContent = () => {
		return (
			<AdminLayout bottomPadding={false} className="p-admin-content-page-create">
				<AdminLayout.Content>
					<div className="p-admin-content__edit">
						<Suspense fallback={<Loading fullscreen owner="ContentPageEditPage" />}>
							<ContentPageEdit
								id={id}
								commonUser={commonUser as Avo.User.CommonUser}
								onGoBack={() =>
									goBrowserBackWithFallback(
										buildLink(ROUTES_BY_LOCALE[locale].adminContentPageDetail, {
											id,
										}),
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
		? tText('pages/admin/content/id/bewerk/index___content-pagina-bewerkenx')
		: tText('pages/admin/content/maak/index___content-pagina-aanmaken');
	const description = id
		? tText('pages/admin/content/id/bewerk/index___bewerk-pagina-van-een-content-pagina')
		: tText('pages/admin/content/maak/index___maak-een-nieuwe-content-pagina-adhv-blokken');
	return (
		<>
			<SeoTags
				title={title}
				description={description}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>

			<PermissionsCheck
				anyPermissions={[Permission.CREATE_CONTENT_PAGES, Permission.EDIT_ANY_CONTENT_PAGES]}
			>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};
