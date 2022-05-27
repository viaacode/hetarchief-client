import { DefaultFilterFormProps } from '../../types';

export type LanguageFilterFormProps = DefaultFilterFormProps<LanguageFilterFormState>;

export interface LanguageFilterFormState {
	languages: string[];
}
