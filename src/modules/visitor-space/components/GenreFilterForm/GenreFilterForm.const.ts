import { ArrayParam } from 'use-query-params';
import { array, object, type SchemaOf, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type GenreFilterFormState } from './GenreFilterForm.types';

export const GENRE_FILTER_FORM_SCHEMA = (): SchemaOf<GenreFilterFormState> =>
	object({
		genres: array(string().required()),
	});

export const GENRE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Genre]: ArrayParam,
};
