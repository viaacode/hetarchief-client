import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface MetadataProps extends DefaultComponentProps {
	title: ReactNode;
	key: string;
	children: ReactNode;
	renderRight?: ReactNode;
	renderedTitleRight?: ReactNode;
}

export interface MetadataListProps extends DefaultComponentProps {
	children: ReactNode;
	allowTwoColumns: boolean;
}

export interface MetadataItem {
	title: string;
	data: string | ReactNode | null | undefined;
}
