import { ArrayParam } from 'use-query-params';
import { type Schema, array, object, string } from 'yup';

import { SearchFilterId } from '../../types';

import { tText } from '@shared/helpers/translate';
import type { GenreFilterFormState } from './GenreFilterForm.types';

export const GENRE_FILTER_FORM_SCHEMA = (): Schema<GenreFilterFormState> =>
	object({
		genres: array(
			string().required(
				tText(
					'modules/visitor-space/components/genre-filter-form/genre-filter-form___genre-is-een-verplicht-veld'
				)
			)
		).required(
			tText(
				'modules/visitor-space/components/genre-filter-form/genre-filter-form___genre-is-een-verplicht-veld'
			)
		),
	});

export const GENRE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Genre]: ArrayParam,
};
