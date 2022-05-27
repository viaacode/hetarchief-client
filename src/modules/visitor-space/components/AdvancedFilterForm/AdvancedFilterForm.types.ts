import { AdvancedFilter, DefaultFilterFormProps } from '../../types';

export type AdvancedFilterFormProps = DefaultFilterFormProps<AdvancedFilterFormState>;

export interface AdvancedFilterFormState {
	advanced: AdvancedFilter[];
}
