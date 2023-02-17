import { DefaultComponentProps } from '@shared/types';

import { IconName } from '../Icon';

export interface ToggleOption {
	id: string;
	iconName: IconName;
	active: boolean;
}

export interface ToggleProps extends DefaultComponentProps {
	options: ToggleOption[];
	onChange: (id: string) => void;
	bordered?: boolean;
	dark?: boolean;
}
