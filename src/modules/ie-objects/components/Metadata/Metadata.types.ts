import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface MetadataProps extends DefaultComponentProps {
	title?: ReactNode;
	key: string;
	children?: ReactNode;
	renderRight?: ReactNode;
	renderedTitleRight?: ReactNode;
	rootElementType?: 'dl' | 'div';
}

export interface MetadataListProps extends DefaultComponentProps {
	children: ReactNode;
	allowTwoColumns: boolean;
	/** Stretches the list to fill the remaining height of a flex-column parent */
	grow?: boolean;
	/** Hides the top divider, for a first section with nothing above it to divide from */
	noDivider?: boolean;
}

export interface MetadataItem {
	title: string;
	data: string | ReactNode | null | undefined;
}
