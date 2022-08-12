import { ReactNode } from 'react';

import { Folder } from '@account/types';

export interface EditCollectionTitleProps {
	onOpenNode?: ReactNode | null;
	collection: Folder;
	afterSubmit?: (values: Folder) => void;
	buttons: Array<{
		before: boolean;
		node: ReactNode;
	}>;
}
