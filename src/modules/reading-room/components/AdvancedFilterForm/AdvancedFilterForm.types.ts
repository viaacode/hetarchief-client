import { AdvancedFilter, DefaultFilterFormProps } from '@reading-room/types';

export type AdvancedFilterFormProps = DefaultFilterFormProps<AdvancedFilterFormState>;

export interface AdvancedFilterFormState {
	advanced: AdvancedFilter[];
}
