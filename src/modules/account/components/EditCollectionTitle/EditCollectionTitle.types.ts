import { ReactNode } from 'react';

import { Collection } from '@account/types';

export interface EditCollectionTitleProps {
	onOpenNode?: ReactNode | null;
	collection: Collection;
	afterSubmit?: (values: Collection) => void;
	buttons: Array<{
		before: boolean;
		node: ReactNode;
	}>;
}
