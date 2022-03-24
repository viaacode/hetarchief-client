import { DefaultFilterFormProps } from '@reading-room/types';

export type KeywordsFilterFormProps = DefaultFilterFormProps<KeywordsFilterFormState>;

export interface KeywordsFilterFormState {
	values: string[];
}
