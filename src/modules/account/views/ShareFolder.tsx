import { useRouter } from 'next/router';
import { type FC, useCallback, useEffect } from 'react';

import { foldersService } from '@account/services/folders';
import { SharedFolderStatus } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { Loading } from '@shared/components/Loading';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { type DefaultSeoInfo } from '@shared/types/seo';

interface AccountSharedFolderProps {
	folderId: string | undefined;
}

export const AccountSharedFolder: FC<DefaultSeoInfo & AccountSharedFolderProps> = ({
	folderId,
}) => {
	const { tText } = useTranslation();
	const router = useRouter();
	const locale = useLocale();

	const shareFolder = useCallback(async () => {
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
						title: tText('pages/account/map-delen/folder-id/index___map-bestaat-al'),
						description: tText(
							'pages/account/map-delen/folder-id/index___deze-map-is-reeds-deel-van-je-mappen'
						),
					});
				}
				// Navigate to shared folder
				const slug = createFolderSlug({
					id: response.folderId,
					name: response.folderName,
					isDefault: false,
				});
				const folderUrl = `${ROUTES_BY_LOCALE[locale].accountMyFolders}/${slug}`;

				await router.replace(folderUrl);
			} catch (err) {
				toastService.notify({
					maxLines: 3,
					title: tText('pages/account/map-delen/folder-id/index___error'),
					description: tText(
						'pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'
					),
				});
				await router.replace(ROUTES_BY_LOCALE[locale].accountMyFolders);
			}
		}
	}, [folderId, locale, router, tText]);

	useEffect(() => {
		shareFolder();
	}, [shareFolder]);

	return <Loading fullscreen owner="share folder page" />;
};
