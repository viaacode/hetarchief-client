import { object, type Schema, string } from 'yup';

import { tText } from '@shared/helpers/translate';

import { type ShareFolderBladeFormState } from './ShareFolderBlade.types';

export const SHARE_FOLDER_FORM_SCHEMA = (): Schema<ShareFolderBladeFormState> => {
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
