import { DefaultComponentProps } from '@shared/types';

export interface MultiSelectProps extends DefaultComponentProps {
	label: string;
	options: MultiSelectOption[];
	onChange: (selected: string[]) => void;
	variant?: string;
}

export interface MultiSelectOption {
	id: string;
	label: string;
}
