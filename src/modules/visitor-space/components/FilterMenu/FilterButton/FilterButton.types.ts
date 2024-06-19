import { type ReactNode } from 'react';

import { type IconName } from '@shared/components/Icon';
import { type DefaultComponentProps } from '@shared/types';

export interface FilterButtonProps extends DefaultComponentProps {
	children?: ReactNode;
	label: ReactNode;
	icon: IconName;
	isActive: boolean;
	type?: 'sort' | 'filter';
	onClick?: () => void;
}
