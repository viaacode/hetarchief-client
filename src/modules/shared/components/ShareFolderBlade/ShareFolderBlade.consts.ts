import { tText } from '@shared/helpers/translate';
import { object, type Schema, string } from 'yup';

import type { ShareFolderBladeFormState } from './ShareFolderBlade.types';

// General Email Regex (RFC 5322 Official Standard) - https://emailregex.com/
const PATTERN_EMAIL =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const SHARE_FOLDER_FORM_SCHEMA = (): Schema<ShareFolderBladeFormState> => {
	return object({
		email: string()
			.email()
			.matches(
				PATTERN_EMAIL,
				tText('pages/account/map-delen/folder-id/index___dit-is-geen-geldig-emailadres')
			)
			.required(tText('pages/account/map-delen/folder-id/index___email-moet-ingevuld-zijn')),
	});
};

export const labelKeys: Record<keyof ShareFolderBladeFormState, string> = {
	email: 'ShareFolderBlade__email',
};

export interface EmailTemplate {
	data: {
		to: string;
		consentToTrack: string;
	};
}
