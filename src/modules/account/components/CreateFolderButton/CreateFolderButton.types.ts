import type { ReactNode } from 'react';

import type { Folder } from '@account/types';

export interface CreateFolderButtonProps {
	children?: ReactNode;
	afterSubmit?: (folder: Folder) => void;
	onOpenNode?: ReactNode | null;
}
