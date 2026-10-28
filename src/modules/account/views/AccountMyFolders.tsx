import { FolderOverview } from '@account/components/FolderOverview';
import { Permission } from '@account/const';
import { AccountLayout } from '@account/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { VisitorLayout } from '@visitor-layout/index';
import type { FC } from 'react';

interface AccountMyFolders {
	folderSlug: string | undefined;
}

export const AccountMyFolders: FC<DefaultSeoInfo & AccountMyFolders> = ({
	url,
	canonicalUrl,
	folderSlug,
}) => {
	return (
		<VisitorLayout>
			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT, Permission.MANAGE_FOLDERS]}>
				<AccountLayout className="p-account-my-folders">
					<FolderOverview
						level="personal"
						folderSlug={folderSlug}
						url={url}
						canonicalUrl={canonicalUrl}
					/>
				</AccountLayout>
			</PermissionsCheck>
		</VisitorLayout>
	);
};
