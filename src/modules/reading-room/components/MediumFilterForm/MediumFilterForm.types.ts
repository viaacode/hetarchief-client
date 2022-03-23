import { DefaultFilterFormProps } from '@reading-room/types';

export type MediumFilterFormProps = DefaultFilterFormProps<MediumFilterFormState>;

export interface MediumFilterFormState {
	mediums: string[];
}
