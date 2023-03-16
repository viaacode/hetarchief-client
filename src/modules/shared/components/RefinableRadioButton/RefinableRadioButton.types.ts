import { DefaultComponentProps } from '@shared/types';

export interface RefinableRadioButtonProps extends DefaultComponentProps {
	options: RefinableRadioButtonOption[];
	value: RefinableRadioButtonInitialState;
	onChange: (selectedOption: string, refinedSelection: string[], isDropdownOpen: boolean) => void;
}

export interface RefinableRadioButtonInitialState {
	selectedOption: string;
	refinedSelection: string[];
}

export interface RefinableRadioButtonDefaultOption {
	id: string;
	label: string;
}

export interface RefinableRadioButtonOption extends RefinableRadioButtonDefaultOption {
	refine?: RefinableRadioButtonRefine;
}

export interface RefinableRadioButtonRefine {
	options: RefinableRadioButtonOption[];
	label: string;
	info?: string;
}

export type RefinableRadioButtonRefineOption = RefinableRadioButtonDefaultOption;
