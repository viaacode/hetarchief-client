export interface ShareFolderBladeProps {
	isOpen: boolean;
	onClose: () => void;
	folderId: string;
}

export interface ShareFolderBladeFormState {
	email: string;
}
