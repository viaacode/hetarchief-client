import { type DefaultFilterFormProps } from '../../types';

export type KeywordsFilterFormProps = DefaultFilterFormProps<KeywordsFilterFormState>;

export interface KeywordsFilterFormState {
	values: string[];
}
