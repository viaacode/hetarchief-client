import { object, SchemaOf, string } from 'yup';

import useTranslation from '@shared/hooks/use-translation/use-translation';

import { ShareFolderBladeFormState } from './ShareFolderBlade.types';

export const SHARE_FOLDER_FORM_SCHEMA = (): SchemaOf<ShareFolderBladeFormState> => {
	const { tText } = useTranslation();

	return object({
		email: string()
			.email(tText('pages/account/map-delen/folder-id/index___dit-is-geen-geldig-emailadres'))
			.required(tText('pages/account/map-delen/folder-id/index___email-moet-ingevuld-zijn')),
	});
};

export const labelKeys: Record<keyof ShareFolderBladeFormState, string> = {
	email: 'ShareFolderBlade__email',
};

export interface EmailTemplate {
	template: string;
	data: {
		to: string;
		consentToTrack: string;
		data: {
			sharer_name: string;
			sharer_email: string;
			folder_name: string;
			folder_sharelink: string;
		};
	};
}
