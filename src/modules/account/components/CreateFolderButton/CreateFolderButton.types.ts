import { ReactNode } from 'react';

import { Folder } from '@account/types';

export interface CreateFolderButtonProps {
	children?: ReactNode;
	afterSubmit?: (folder: Folder) => void;
	onOpenNode?: ReactNode | null;
}
