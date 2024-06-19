import { type DefaultFilterFormProps } from '../../types';

export type CreatorFilterFormProps = DefaultFilterFormProps<CreatorFilterFormState>;

export interface CreatorFilterFormState {
	creator: string;
}
