import { BooleanParam } from 'use-query-params';
import { boolean, object, SchemaOf } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { MediaFilterFormState } from './MediaFilterForm.types';

export const MEDIA_FILTER_FORM_SCHEMA = (): SchemaOf<MediaFilterFormState> =>
	object({
		isConsultableMedia: boolean().required(),
	});

export const MEDIA_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Media]: BooleanParam,
};
