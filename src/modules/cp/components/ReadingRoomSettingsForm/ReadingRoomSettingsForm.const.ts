import { i18n } from 'next-i18next';
import { mixed, object, SchemaOf, string } from 'yup';

import { ReadingRoomFormState } from './ReadingRoomSettingsForm.types';

export const READING_ROOM_SETTINGS_SCHEMA = (): SchemaOf<ReadingRoomFormState> => {
	return object({
		color: string().matches(/^#([0-9A-F]{3}){1,2}$/i, {
			message: i18n?.t('Kleur moet een geldige hex-code zijn.') ?? 'Invalid color',
		}),
		image: mixed(),
	});
};
