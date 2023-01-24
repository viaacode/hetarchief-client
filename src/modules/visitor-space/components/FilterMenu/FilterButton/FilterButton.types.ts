import { ReactNode } from 'react';

import { IconName } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface FilterButtonProps extends DefaultComponentProps {
	label: ReactNode;
	icon: IconName;
	isActive: boolean;
	type?: 'sort' | 'filter';
	onClick?: () => void;
}
