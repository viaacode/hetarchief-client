import { type ReactNode } from 'react';

import { type Folder } from '@account/types';

export interface EditFolderTitleProps {
	children?: ReactNode;
	onOpenNode?: ReactNode | null;
	folder: Folder;
	afterSubmit?: (values: Folder) => Promise<void>;
	buttons: Array<{
		before: boolean;
		node: ReactNode;
	}>;
}
