import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

export interface MetadataProps extends DefaultComponentProps {
	title: ReactNode;
	key: string;
	children: ReactNode;
	renderRight?: ReactNode;
	renderTitleRight?: ReactNode;
}

export interface MetadataListProps extends DefaultComponentProps {
	children: ReactNode;
	allowTwoColumns: boolean;
}

export interface MetadataItem {
	title: string | ReactNode;
	data: string | ReactNode | null | undefined;
}
