import { kebabCase } from 'lodash-es';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ComponentType, useEffect } from 'react';

import { foldersService } from '@account/services/folders';
import { SharedFolderStatus } from '@account/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { Loading } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';
import { DefaultSeoInfo } from '@shared/types/seo';

const AccountSharedFolder: NextPage<DefaultSeoInfo> = () => {
	const { tText } = useTranslation();
	const { asPath } = useRouter();
	const router = useRouter();

	const folderId = asPath.split('/').pop();

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
					await router.replace(
						`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myFolders}/${kebabCase(
							response.folderName
						)}--${response.folderId.split('-')[0]}`
					);
				} catch (err) {
					toastService.notify({
						maxLines: 3,
						title: tText('pages/account/map-delen/folder-id/index___error'),
						description: tText(
							'pages/account/map-delen/folder-id/index___error-er-is-iets-misgelopen'
						),
					});
					await router.replace(`/${ROUTE_PARTS.account}/${ROUTE_PARTS.myFolders}`);
				}
			}
		}
		shareFolder();
	}, [folderId]);

	return <Loading fullscreen owner="share folder page" />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountSharedFolder as ComponentType, true);
