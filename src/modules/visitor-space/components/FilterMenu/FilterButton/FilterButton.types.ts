import type { IconName } from '@shared/components/Icon';
import type { DefaultComponentProps } from '@shared/types';
import type { ReactNode } from 'react';

export interface FilterButtonProps extends DefaultComponentProps {
	children?: ReactNode;
	label: ReactNode;
	ariaLabel?: string;
	icon: IconName;
	isActive: boolean;
	type?: 'sort' | 'filter';
	/** The panel is dark, the advanced fly-out is white. Defaults to the dark panel. */
	variants?: string[];
	onClick?: () => void;
}
