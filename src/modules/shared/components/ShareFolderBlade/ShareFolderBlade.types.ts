export interface ShareFolderBladeProps {
	isOpen: boolean;
	onClose: () => void;
	folderId: string;
	folderName: string;
}

export interface ShareFolderBladeFormState {
	email: string;
}
