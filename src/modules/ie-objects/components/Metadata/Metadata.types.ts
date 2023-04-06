import { ReactNode } from 'react';

import { DefaultComponentProps } from '@shared/types';

export interface MetadataProps extends DefaultComponentProps {
	metadata: MetadataItem[];
	disableContainerQuery?: boolean;
	onOpenRequestAccess?: () => void;
}

export interface MetadataItem {
	title: string | ReactNode;
	data: string | ReactNode;
	className?: string;
	customData?: boolean;
	customTitle?: boolean;
	isDisabled?: () => boolean;
}
