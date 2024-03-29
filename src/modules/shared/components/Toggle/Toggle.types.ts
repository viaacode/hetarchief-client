import { DefaultComponentProps } from '@shared/types';

import { IconName } from '../Icon';

export interface ToggleOption {
	id: string;
	iconName: IconName;
	active: boolean;
}

export interface ToggleProps extends DefaultComponentProps {
	children?: React.ReactNode;
	options: ToggleOption[];
	onChange: (id: string) => void;
	bordered?: boolean;
	dark?: boolean;
}
