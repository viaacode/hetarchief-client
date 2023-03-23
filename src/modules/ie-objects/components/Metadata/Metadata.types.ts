import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface MetadataProps extends DefaultComponentProps {
	metadata: MetadataItem[];
	disableContainerQuery?: boolean;
}

export interface MetadataItem {
	title: string | ReactNode;
	data: string | ReactNode;
	className?: string;
}
