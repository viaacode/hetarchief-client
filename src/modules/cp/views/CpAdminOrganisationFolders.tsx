import { FolderOverview } from '@account/components/FolderOverview';
import { Permission } from '@account/const';
import { CPAdminLayout } from '@cp/layouts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import type { DefaultSeoInfo } from '@shared/types/seo';
import type { FC } from 'react';

interface CpAdminOrganisationFoldersProps {
	folderSlug: string | undefined;
}

/**
 * Folders that belong to the organisation and are shared between all CP admins of that organisation
 */
export const CpAdminOrganisationFolders: FC<DefaultSeoInfo & CpAdminOrganisationFoldersProps> = ({
	url,
	canonicalUrl,
	folderSlug,
}) => {
	return (
		<PermissionsCheck
			allPermissions={[Permission.MANAGE_FOLDERS, Permission.MANAGE_ORGANISATION_FOLDERS]}
		>
			<CPAdminLayout className="p-account-my-folders">
				<FolderOverview
					level="organisation"
					folderSlug={folderSlug}
					url={url}
					canonicalUrl={canonicalUrl}
				/>
			</CPAdminLayout>
		</PermissionsCheck>
	);
};
