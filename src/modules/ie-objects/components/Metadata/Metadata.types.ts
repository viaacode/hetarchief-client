import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface MetadataProps extends DefaultComponentProps {
	title: ReactNode;
	key: string;
	children: ReactNode;
}

export interface MetadataListProps extends DefaultComponentProps {
	children: ReactNode;
	disableContainerQuery: boolean;
}

export interface MetadataItem {
	title: string | ReactNode;
	data: string | null | undefined;
}
