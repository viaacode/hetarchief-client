import { ReactNode } from 'react';

import { Folder } from '@account/types';

export interface EditFolderTitleProps {
	onOpenNode?: ReactNode | null;
	folder: Folder;
	afterSubmit?: (values: Folder) => Promise<void>;
	buttons: Array<{
		before: boolean;
		node: ReactNode;
	}>;
}
