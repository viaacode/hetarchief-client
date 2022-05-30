import { DefaultFilterFormProps } from '../../types';

export type MediumFilterFormProps = DefaultFilterFormProps<MediumFilterFormState>;

export interface MediumFilterFormState {
	mediums: string[];
}
