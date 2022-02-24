import { i18n } from 'next-i18next';
import { object, SchemaOf, string } from 'yup';

import { CreateCollectionFormState } from '@account/types';

export const CREATE_COLLECTION_FORM_SCHEMA = (): SchemaOf<CreateCollectionFormState> => {
	const nameLengthMin = 3;

	return object({
		name: string().test(
			'name',
			i18n?.t(
				'modules/account/const/my-collections___de-naam-van-een-map-moet-minstens-count-tekens-lang-zijn',
				{
					count: nameLengthMin,
				}
			) || '',
			(val) => {
				return (val || '').length >= 3;
			}
		),
	});
};
