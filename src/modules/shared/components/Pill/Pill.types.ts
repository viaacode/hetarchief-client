import type { IconName } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface PillProps extends DefaultComponentProps {
	children?: ReactNode;
	icon: IconName;
	label: string;
	isExpanded?: boolean;
	ariaLabel?: string;
}
