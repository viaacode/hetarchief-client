import { BooleanParam } from 'use-query-params';
import { boolean, object, SchemaOf } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types';
import { ConsultableOnlyOnLocationFilterFormState } from '@visitor-space/components';

import { VisitorSpaceFilterId } from '../../types';

export const CONSULTABLE_ONLY_ON_LOCATION_FILTER_FORM_SCHEMA =
	(): SchemaOf<ConsultableOnlyOnLocationFilterFormState> =>
		object({
			[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: boolean().required(),
		});

export const REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.ConsultableOnlyOnLocation]: BooleanParam,
};
