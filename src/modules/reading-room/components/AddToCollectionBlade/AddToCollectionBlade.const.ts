import { array, boolean, object, SchemaOf, string } from 'yup';

import { i18n } from '@shared/helpers/i18n';

import { AddToCollectionFormState } from './AddToCollectionBlade.types';

export const ADD_TO_COLLECTION_FORM_SCHEMA = (): SchemaOf<AddToCollectionFormState> => {
	return object({
		pairs: array()
			.of(
				object().shape({
					id: string().required(
						i18n.t(
							'modules/reading-room/components/add-to-collection-blade/add-to-collection-blade___de-geselecteerde-map-bestaat-niet'
						)
					),
					checked: boolean(),
				})
			)
			.required(),
	});
};
