import { ReactNode } from 'react';

export interface CreateFolderButtonProps {
	children?: React.ReactNode;
	afterSubmit?: () => void;
	onOpenNode?: ReactNode | null;
}
