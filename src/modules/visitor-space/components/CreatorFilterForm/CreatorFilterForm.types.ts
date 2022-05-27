import { DefaultFilterFormProps } from '../../types';

export type CreatorFilterFormProps = DefaultFilterFormProps<CreatorFilterFormState>;

export interface CreatorFilterFormState {
	creators: string[];
}
