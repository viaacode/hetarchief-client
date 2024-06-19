import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { object, type SchemaOf, string } from 'yup';

import { type CreateFolderFormState } from '@account/types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';

export const FolderItemListSize = 20;

export const ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const COLLECTION_FORM_SCHEMA = (): SchemaOf<CreateFolderFormState> => {
	const nameLengthMin = 3;
	const nameLengthMax = 90;

	return object({
		name: string()
			.test(
				'name',
				tText(
					'modules/account/const/my-folders___de-naam-van-een-map-moet-minstens-count-tekens-lang-zijn',
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
				tText(
					'modules/account/const/my-folders___de-naam-van-een-map-mag-niet-meer-dan-count-tekens-lang-zijn',
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
