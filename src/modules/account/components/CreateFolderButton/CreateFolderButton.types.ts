import { ReactNode } from 'react';

export interface CreateFolderButtonProps {
	afterSubmit?: () => void;
	onOpenNode?: ReactNode | null;
}
