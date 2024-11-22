import { object, type Schema, string } from 'yup';

import type { Folder } from '@account/types';
import { tText } from '@shared/helpers/translate';

export const EDIT_FOLDER_VALIDATION_SCHEMA = (): Schema<
	Partial<Pick<Folder, 'name' | 'description'>>
> => {
	return object({
		name: string()
			.required(
				tText(
					'modules/account/components/edit-folder-blade/edit-folder-blade___je-moet-je-map-een-naam-geven'
				)
			)
			.max(
				255,
				tText(
					'modules/account/components/edit-folder-blade/edit-folder-blade___je-mapnaam-is-te-lang-de-naam-mag-niet-langer-dan-90-tekens-zijn'
				)
			),
		description: string(),
	});
};
