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
	onClick?: () => void;
}
