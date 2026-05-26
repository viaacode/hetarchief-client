import type { DefaultFilterFormProps } from '../../types';

export type ReusabilityFilterFormProps = DefaultFilterFormProps<ReusabilityFilterFormState>;

export interface ReusabilityFilterFormState {
	reusability: string[];
}
