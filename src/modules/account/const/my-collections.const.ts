import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { object, SchemaOf, string } from 'yup';

import { CreateCollectionFormState } from '@account/types';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { i18n } from '@shared/helpers/i18n';

export const CollectionItemListSize = 20;

export const ACCOUNT_COLLECTIONS_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const COLLECTION_FORM_SCHEMA = (): SchemaOf<CreateCollectionFormState> => {
	const nameLengthMin = 3;
	const nameLengthMax = 90;

	return object({
		name: string()
			.test(
				'name',
				i18n.t(
					'modules/account/const/my-collections___de-naam-van-een-map-moet-minstens-count-tekens-lang-zijn',
					{
						count: nameLengthMin,
					}
				),
				(val) => {
					return (val || '').length >= nameLengthMin;
				}
			)
			.test(
				'name',
				i18n.t(
					'modules/account/const/my-collections___de-naam-van-een-map-mag-niet-meer-dan-count-tekens-lang-zijn',
					{
						count: nameLengthMax,
					}
				),
				(val) => {
					return (val || '').length <= nameLengthMax;
				}
			),
	});
};
