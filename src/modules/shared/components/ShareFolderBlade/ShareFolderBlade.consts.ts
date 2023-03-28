import { object, SchemaOf, string } from 'yup';

import { ShareFolderBladeFormState } from './ShareFolderBlade.types';

export const SHARE_FOLDER_FORM_SCHEMA = (): SchemaOf<ShareFolderBladeFormState> =>
	object({
		email: string().email().required('Dit is geen geldig emailadres'),
	});

export const labelKeys: Record<keyof ShareFolderBladeFormState, string> = {
	email: 'ShareFolderBlade__email',
};
