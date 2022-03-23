import { DefaultFilterFormProps } from '@reading-room/types';

export type LanguageFilterFormProps = DefaultFilterFormProps<LanguageFilterFormState>;

export interface LanguageFilterFormState {
	languages: string[];
}
