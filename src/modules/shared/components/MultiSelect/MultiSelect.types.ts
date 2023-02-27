import { DefaultComponentProps } from '@shared/types';

export interface MultiSelectProps extends DefaultComponentProps {
	label: string;
	options: MultiSelectOption[];
	onChange: (selected: string[]) => void;
}

export interface MultiSelectOption {
	id: string;
	label: string;
}
