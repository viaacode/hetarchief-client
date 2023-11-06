import { ReactNode } from 'react';

import { Folder } from '@account/types';

export interface CreateFolderButtonProps {
	children?: React.ReactNode;
	afterSubmit?: (folder: Partial<Folder>) => void;
	onOpenNode?: ReactNode | null;
}
