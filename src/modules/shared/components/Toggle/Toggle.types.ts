import { DefaultComponentProps } from '@shared/types';

import { IconLightNames } from '../Icon';

export interface ToggleOption {
	id: string;
	iconName: IconLightNames;
	active: boolean;
}

export interface ToggleProps extends DefaultComponentProps {
	options: ToggleOption[];
	onChange: (id: string) => void;
	bordered?: boolean;
	dark?: boolean;
}
