import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { GenreFilterFormState } from './GenreFilterForm.types';

export const GENRE_FILTER_FORM_SCHEMA = (): SchemaOf<GenreFilterFormState> =>
	object({
		genres: array(string().required()),
	});

export const GENRE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Genre]: ArrayParam,
};
