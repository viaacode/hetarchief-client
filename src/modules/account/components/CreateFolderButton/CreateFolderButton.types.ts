import type { Folder } from '@account/types';
import type { ReactNode } from 'react';

export interface CreateFolderButtonProps {
	children?: ReactNode;
	afterSubmit?: (folder: Folder) => void;
	onOpenNode?: ReactNode | null;
	/**
	 * Keep showing the + icon while the name is being typed, so the input does not shift to the left
	 */
	keepIconWhenOpen?: boolean;
	/**
	 * Always create an organisation folder, eg: on the organisation folders overview
	 */
	isOrganisation?: boolean;
	/**
	 * Show a checkbox to create an organisation folder instead of a personal folder
	 * Only for users with the MANAGE_ORGANISATION_FOLDERS permission
	 */
	showOrganisationOption?: boolean;
}
