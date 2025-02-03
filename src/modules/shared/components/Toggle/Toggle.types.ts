import type { ReactNode } from 'react';

import type { DefaultComponentProps } from '@shared/types';

import type { IconName } from '../Icon';

export interface ToggleOption {
	id: string;
	iconName: IconName;
	active: boolean;
	title?: string;
}

export interface ToggleProps extends DefaultComponentProps {
	children?: ReactNode;
	options: ToggleOption[];
	onChange: (id: string) => void;
	bordered?: boolean;
	dark?: boolean;
}
