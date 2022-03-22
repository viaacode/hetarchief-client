import { DefaultFilterFormProps } from '@reading-room/types';

export type GenreFilterFormProps = DefaultFilterFormProps<GenreFilterFormState>;

export interface GenreFilterFormState {
	genres: string[];
}
