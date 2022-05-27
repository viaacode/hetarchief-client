import { DefaultFilterFormProps } from '../../types';

export type GenreFilterFormProps = DefaultFilterFormProps<GenreFilterFormState>;

export interface GenreFilterFormState {
	genres: string[];
}
