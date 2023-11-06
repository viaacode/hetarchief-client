export interface ShareFolderBladeProps {
	children?: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	folderId: string;
	folderName: string;
}

export interface ShareFolderBladeFormState {
	email: string;
}
