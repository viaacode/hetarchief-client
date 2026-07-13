import type { Folder } from '@account/types';
import type { ReactNode } from 'react';

export interface CreateFolderButtonProps {
	children?: ReactNode;
	afterSubmit?: (folder: Folder) => void;
	onOpenNode?: ReactNode | null;
}
