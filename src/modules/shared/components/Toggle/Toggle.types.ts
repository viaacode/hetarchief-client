import { IconLightNames } from '..';

export interface ToggleOptions {
	id: string;
	iconName: IconLightNames;
	active: boolean;
}

export interface ToggleProps {
	options: ToggleOptions[];
	onChange: (id: string) => void;
}
