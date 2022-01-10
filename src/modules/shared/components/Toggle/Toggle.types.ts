import { IconLightNames } from '..';

import { DefaultComponentProps } from '@shared/types';

export interface ToggleOptions {
	id: string;
	iconName: IconLightNames;
	active: boolean;
}

export interface ToggleProps extends DefaultComponentProps {
	options: ToggleOptions[];
	onChange: (id: string) => void;
	bordered?: boolean;
}
