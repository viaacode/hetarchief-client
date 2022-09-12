import { array, boolean, object, SchemaOf, string } from 'yup';

import { TranslationService } from '@shared/services/translation-service/translation-service';

import { AddToFolderFormState } from './AddToFolderBlade.types';

export const ADD_TO_FOLDER_FORM_SCHEMA = (): SchemaOf<AddToFolderFormState> => {
	return object({
		pairs: array()
			.of(
				object().shape({
					folder: string().required(
						TranslationService.t(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___de-geselecteerde-map-bestaat-niet'
						)
					),
					ie: string().required(
						TranslationService.t(
							'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___het-geselecteerde-item-bestaat-niet'
						)
					),
					checked: boolean(),
				})
			)
			.required(),
	});
};
