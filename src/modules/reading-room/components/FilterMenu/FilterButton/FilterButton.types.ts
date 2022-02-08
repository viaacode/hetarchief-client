import { ReactNode } from 'react';

import { IconLightNames } from '@shared/components';
import { DefaultComponentProps } from '@shared/types';

export interface FilterButtonProps extends DefaultComponentProps {
	label: ReactNode;
	icon: IconLightNames;
	isActive: boolean;
	type?: 'sort' | 'filter';
	onClick?: () => void;
}
