import { array, boolean, object, SchemaOf, string } from 'yup';

import { i18n } from '@shared/helpers/i18n';

import { AddToFolderFormState } from './AddToFolderBlade.types';

export const ADD_TO_FOLDER_FORM_SCHEMA = (): SchemaOf<AddToFolderFormState> => {
	return object({
		pairs: array()
			.of(
				object().shape({
					folder: string().required(
						i18n.t(
							'modules/visitor-space/components/add-to-collection-blade/add-to-folder-blade___de-geselecteerde-map-bestaat-niet'
						)
					),
					ie: string().required(
						i18n?.t(
							'modules/visitor-space/components/add-to-collection-blade/add-to-folder-blade___het-geselecteerde-item-bestaat-niet'
						)
					),
					checked: boolean(),
				})
			)
			.required(),
	});
};
