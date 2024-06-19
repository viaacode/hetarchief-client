import { type ReactNode } from 'react';

export interface ShareFolderBladeProps {
	children?: ReactNode;
	isOpen: boolean;
	onClose: () => void;
	folderId: string;
	folderName: string;
}

export interface ShareFolderBladeFormState {
	email: string;
}
