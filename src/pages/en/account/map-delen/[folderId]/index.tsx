import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';

import { foldersService } from '@account/services/folders';
import { SharedFolderStatus } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { withAuth } from '@auth/wrappers/with-auth';
import { Loading } from '@shared/components';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { DefaultSeoInfo } from '@shared/types/seo';

const AccountSharedFolder: NextPage<DefaultSeoInfo> = () => {
	const { tText } = useTranslation();
	const router = useRouter();
	const locale = useLocale();

	const folderId = router.asPath.split('/').pop();

	useEffect(() => {
		async function shareFolder() {
			if (folderId) {
				try {
					const response = await foldersService.shareCollection(folderId);
					if (response.status === SharedFolderStatus.ADDED) {
						toastService.notify({
							maxLines: 3,
							title: tText('pages/account/map-delen/folder-id/index___gelukt'),
							description: tText(
								'pages/account/map-delen/folder-id/index___gelukt-beschrijving'
							),
						});
					}
					if (response.status === SharedFolderStatus.ALREADY_OWNER) {
						toastService.notify({
							maxLines: 3,
							title: tText(
								'pages/account/map-delen/folder-id/index___map-bestaat-al'
							),
							description: tText(
								'pages/account/map-delen/folder-id/index___deze-map-is-reeds-deel-van-je-mappen'
							),
						});
					}
					// Ward: navigate to shared folder
					const slug = createFolderSlug({
						id: response.folderId,
						name: response.folderName,
						isDefault: false,
					});
					const folderUrl = `/${ROUTE_PARTS_BY_LOCALE[locale].account}/${ROUTE_PARTS_BY_LOCALE[locale].myFolders}/${slug}`;

					await router.replace(folderUrl);
				} catch (err) {
					toastService.notify({
						maxLines: 3,
						title: tText('pages/account/map-delen/folder-id/index___error'),
						description: tText(
							'pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'
						),
					});
					await router.replace(
						`/${ROUTE_PARTS_BY_LOCALE[locale].account}/${ROUTE_PARTS_BY_LOCALE[locale].myFolders}`
					);
				}
			}
		}
		shareFolder();
	}, [folderId, locale, router, tText]);

	return <Loading fullscreen owner="share folder page" />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountSharedFolder as ComponentType, true);
