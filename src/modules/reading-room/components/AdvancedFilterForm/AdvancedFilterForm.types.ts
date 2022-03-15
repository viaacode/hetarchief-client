import { DefaultFilterFormProps } from '@reading-room/types';

export type AdvancedFilterFormProps = DefaultFilterFormProps<AdvancedFilterFormState>;

export interface AdvancedFilterFormState {
	advanced: AdvancedFilterFieldsState[];
}

export interface AdvancedFilterFieldsState {
	metadataProp?: string;
	operator?: string;
	value?: string;
}

export interface AdvancedFilterFieldsQueryValues {
	prop: string;
	op: string;
	val: string;
}
