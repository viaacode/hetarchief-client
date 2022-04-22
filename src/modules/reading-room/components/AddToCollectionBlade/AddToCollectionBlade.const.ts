import { i18n } from 'next-i18next';
import { array, boolean, object, SchemaOf, string } from 'yup';

import { AddToCollectionFormState } from './AddToCollectionBlade.types';

export const ADD_TO_COLLECTION_FORM_SCHEMA = (): SchemaOf<AddToCollectionFormState> => {
	return object({
		pairs: array()
			.of(
				object().shape({
					collection: string().required(
						i18n?.t(
							'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___de-geselecteerde-map-bestaat-niet'
						)
					),
					ie: string().required(
						i18n?.t(
							'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___het-geselecteerde-item-bestaat-niet'
						)
					),
					checked: boolean(),
				})
			)
			.required(),
	});
};
