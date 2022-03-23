import { DefaultFilterFormProps } from '@reading-room/types';

export type CreatorFilterFormProps = DefaultFilterFormProps<CreatorFilterFormState>;

export interface CreatorFilterFormState {
	creators: string[];
}
