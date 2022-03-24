import { array, object, SchemaOf, string } from 'yup';

import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import { ReadingRoomFilterId } from '@reading-room/types';
import { Operator } from '@shared/types';

import { KeywordsFilterFormState } from './KeywordsFilterForm.types';

export const KEYWORDS_FILTER_FORM_SCHEMA = (): SchemaOf<KeywordsFilterFormState> =>
	object({
		values: array(string().required()),
	});

export const KEYWORDS_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Keywords]: AdvancedFilterArrayParam,
};
