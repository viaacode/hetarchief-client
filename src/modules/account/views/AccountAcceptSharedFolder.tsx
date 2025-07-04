import { useRouter } from 'next/router';
import { type FC, useCallback, useEffect } from 'react';

import { FoldersService } from '@account/services/folders';
import { SharedFolderStatus } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { Loading } from '@shared/components/Loading';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import type { DefaultSeoInfo } from '@shared/types/seo';

interface AccountSharedFolderProps {
	folderId: string | undefined;
}

export const AccountAcceptSharedFolder: FC<DefaultSeoInfo & AccountSharedFolderProps> = ({
	folderId,
}) => {
	const router = useRouter();
	const locale = useLocale();

	const shareFolder = useCallback(async () => {
		if (folderId) {
			try {
				const response = await FoldersService.shareFolder(folderId);
				if (response.status === SharedFolderStatus.ADDED) {
					toastService.notify({
						maxLines: 3,
						title: tText('pages/account/map-delen/folder-id/index___gelukt'),
						description: tText('pages/account/map-delen/folder-id/index___gelukt-beschrijving'),
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
				const slug = createFolderSlug(
					{
						id: response.folderId,
						name: response.folderName,
						isDefault: false,
					},
					locale
				);
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
	}, [folderId, locale, router]);

	useEffect(() => {
		shareFolder();
	}, [shareFolder]);

	return <Loading fullscreen owner="share folder page" />;
};
