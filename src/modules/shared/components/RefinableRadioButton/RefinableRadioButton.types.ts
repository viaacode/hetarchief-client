export interface RefinableRadioButtonProps {
	options: RefinableRadioButtonOption[];
	initialState: RefinableRadioButtonInitialState;
	onChange: (selectedOption: string, refinedSelection: string[]) => void;
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
